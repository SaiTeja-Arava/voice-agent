from qwen_agent.tools.base import register_tool, BaseTool

@register_tool('calculator')
class Calculator(BaseTool):
    """A calculator for performing mathematical calculations."""
    
    description = "Calculates the result of mathematical expressions."
    parameters = [{
        "name": "expression",
        "type": "string",
        "description": "The mathematical expression to evaluate, e.g. '2 + 2' or '(3 * 4) / 2'"
    }]
    
    def call(self, expression):
        """Evaluates a mathematical expression and returns the result."""
        try:
            # Basic security: limit to mathematical operations
            allowed_chars = set("0123456789+-*/().% ")
            if not all(c in allowed_chars for c in expression):
                return "Error: Expression contains invalid characters"
            
            # Evaluate and return the result
            result = eval(expression)
            return f"The result of {expression} is {result}"
        except Exception as e:
            return f"Error calculating expression: {str(e)}"