# Checklist: 10 cosas que sí revisas aunque no leas el código

1. El agente hizo lo que pedí, y nada más.
2. Sé qué archivos tocó y ninguno me sorprende.
3. El trabajo está en una rama, no directo en `main`.
4. Hay al menos un test que falló antes del cambio y ahora pasa.
5. Corrí los tests yo (o vi la salida real), no solo el agente diciendo que pasan.
6. No entró ninguna dependencia nueva que no entienda.
7. No hay llaves, tokens ni `.env` en el diff.
8. Si toca datos, permisos o pagos, leí esas partes o tengo un respaldo.
9. Probé el cambio funcionando con mis propios ojos.
10. Sé qué no se verificó y lo anoté.
