from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet,quiz_front ,QuestionViewSet, ChoiceViewSet, api_root  # ← Add QuestionViewSet, ChoiceViewSet
router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)    # ← ADD THIS
router.register(r'choices', ChoiceViewSet)        # ← ADD THIS
urlpatterns = [
    path('', api_root, name='api-root'),
    path('front/', quiz_front, name='quiz-front'),  # ← NUEVA RUTA FRONT
    path('', include(router.urls)),
]