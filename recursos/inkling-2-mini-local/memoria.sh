#!/bin/bash
# Memoria ocupada de verdad en macOS (apps + GPU/sistema fijo + comprimida), en GB.
# Antes de cargar un modelo local quieres menos de 6 GB en una Mac de 16 GB.
vm_stat | awk '/page size of/{ps=$8} /Anonymous pages/{a=$3} /Pages wired/{w=$4} /occupied by compressor/{c=$5}
END{g=(a+w+c)*ps/2^30; printf "Memoria ocupada: %.1f GB\n", g; if (g>6) print "Cierra apps antes de cargar el modelo."; else print "OK para cargar."}'
