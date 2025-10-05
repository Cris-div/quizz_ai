from rest_framework import serializers
from .models import Quiz, Question, Choice  # ← Add Question, Choice

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

# Keep your existing QuizSerializer above ⬆️

# UPDATE THE IMPORT LINE AT THE TOP:

# ADD THESE NEW SERIALIZERS ⬇️

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'created_at']
        read_only_fields = ['created_at']

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'text', 'is_correct']

# Keep all your existing serializers above ⬆️

# ADD THESE NEW SERIALIZERS ⬇️

class ChoiceDetailSerializer(serializers.ModelSerializer):
    """For displaying choices without revealing correct answers"""
    class Meta:
        model = Choice
        fields = ['id', 'text']

class QuestionDetailSerializer(serializers.ModelSerializer):
    """Question with all its choices"""
    choices = ChoiceDetailSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizDetailSerializer(serializers.ModelSerializer):
    """Complete quiz with questions and choices"""
    questions = QuestionDetailSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'question_count', 'questions']
    
    def get_question_count(self, obj):
        return obj.questions.count()

class SubmitAnswerSerializer(serializers.Serializer):
    """For validating submitted answers"""
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()