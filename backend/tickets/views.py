from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from .models import Ticket
from .serializers import TicketSerializer
import os
import json
from openai import OpenAI

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()
        
        # Average tickets per day
        daily_stats = Ticket.objects.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).aggregate(
            avg_per_day=Avg('count')
        )
        avg_tickets = daily_stats['avg_per_day'] or 0
        
        # Priority breakdown
        priority_counts = Ticket.objects.values('priority').annotate(count=Count('id'))
        priority_breakdown = {item['priority']: item['count'] for item in priority_counts}
        
        # Category breakdown
        category_counts = Ticket.objects.values('category').annotate(count=Count('id'))
        category_breakdown = {item['category']: item['count'] for item in category_counts}

        # Fill missing keys with 0 for consistent API response
        for choice in Ticket.PRIORITY_CHOICES:
            priority_breakdown.setdefault(choice[0], 0)
        for choice in Ticket.CATEGORY_CHOICES:
            category_breakdown.setdefault(choice[0], 0)

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets, 1),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })

    @action(detail=False, methods=['post'])
    def classify(self, request):
        description = request.data.get('description', '')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
             return Response({"error": "LLM API Key not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        client = OpenAI(api_key=api_key)
        
        prompt = f"""
        Analyze the following support ticket description and suggest a category and priority.
        
        Categories: billing, technical, account, general
        Priorities: low, medium, high, critical
        
        Description: "{description}"
        
        Return ONLY a JSON object with keys "suggested_category" and "suggested_priority".
        """

        try:
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful support assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
            )
            
            content = completion.choices[0].message.content
            # Basic cleanup if markdown formatting is present
            content = content.replace('```json', '').replace('```', '').strip()
            
            result = json.loads(content)
            return Response(result)

        except Exception as e:
            # Graceful fallback or error logging
            print(f"LLM Error: {e}")
            return Response({
                "suggested_category": "general",
                "suggested_priority": "medium",
                "warning": "LLM classification failed, using defaults."
            })
