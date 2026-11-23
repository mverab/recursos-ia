Hay un bug en egeo/fidelity.py y necesito que lo arregles.

`extract_invariants` normaliza los números quitando las comas. Eso asume que la coma separa miles, pero en español (y alemán, francés, etc.) la coma es el separador decimal. Resultado:

```python
from egeo.fidelity import check_fidelity
original = "## Valoración\nLa valoración media es 8,7 sobre 10."
rewrite  = "## Valoración\nLa valoración media es 87 sobre 10."
print(check_fidelity(original, rewrite))
# FidelityResult(passed=True, violations=())   <- 8,7 se volvió 87 y el gate dice que todo bien
```

Comportamiento esperado:
| Caso | Hoy | Debería |
|---|---|---|
| `8,7` → `87` | passed=True | violación |
| `1.234,50 €` → `123450 €` | lo ve como dos números (1.234 y 50) | un solo número, 1234.50 → 123450, violación |
| `1.185` → `1185` (mismo valor, otro formato) | violación (falso positivo) | sin violación |

Arréglalo en el código, añade tests para estos casos y asegúrate de que toda la suite existente siga pasando (`pytest -q`). No cambies el comportamiento para números en formato inglés que hoy funcionan bien.
