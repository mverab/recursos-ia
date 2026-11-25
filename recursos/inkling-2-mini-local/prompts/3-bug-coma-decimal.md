Esta función de Python tiene un bug y necesito que lo arregles.

```python
import re

def extraer_numeros(texto):
    """Devuelve los números de un texto como float."""
    nums = re.findall(r"\d[\d.,]*", texto)
    return [float(n.replace(",", "")) for n in nums]
```

Quita las comas porque asume que la coma separa miles. Pero en español la coma es el separador decimal. Resultado:

```python
extraer_numeros("La nota media es 8,7 sobre 10")  # devuelve [87.0, 10.0]
```

Comportamiento esperado:
| Texto | Hoy | Debería |
|---|---|---|
| `8,7` | 87.0 | 8.7 |
| `1.234,50 €` | error o número equivocado | 1234.5 |
| `1,234.50 $` (formato inglés) | 1234.5 | 1234.5 (no romperlo) |
| `1.185 visitas` | 1.185 | 1185 (punto de miles) |
| `3,5 y 12` | [35.0, 12.0] | [3.5, 12.0] |

Arregla la función y añade tests con pytest para estos casos.
Responde con dos bloques de código: primero `extraer.py` (solo la función, con sus imports) y después `test_extraer.py`.
