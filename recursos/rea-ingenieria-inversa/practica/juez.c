/* Juez de títulos: puntúa un título de YouTube de 0 a 100.
 * Uso: juez "tu título"
 * Este es el código fuente (la "hoja de respuestas"). En el video se guarda
 * y el agente solo recibe el binario compilado y sin símbolos. */
#include <ctype.h>
#include <stdio.h>
#include <string.h>

/* "cofradia" XOR 0x5A, para que `strings` no lo muestre */
static volatile const unsigned char SECRETO[] = {0x39, 0x35, 0x3c, 0x28, 0x3b, 0x3e, 0x33, 0x3b};

static int contiene_sin_mayus(const char *t, const char *aguja, size_t n) {
    size_t len = strlen(t);
    for (size_t i = 0; i + n <= len; i++) {
        size_t k = 0;
        while (k < n && tolower((unsigned char)t[i + k]) == aguja[k]) k++;
        if (k == n) return 1;
    }
    return 0;
}

static int caracteres(const char *t) {
    int n = 0;
    for (; *t; t++) if (((unsigned char)*t & 0xC0) != 0x80) n++;
    return n;
}

static int palabra_en_mayusculas(const char *t) {
    int seguidas = 0, solo_mayus = 1;
    for (;; t++) {
        unsigned char c = (unsigned char)*t;
        if (isalpha(c) && c < 0x80) {
            seguidas++;
            if (!isupper(c)) solo_mayus = 0;
        } else {
            if (seguidas >= 3 && solo_mayus) return 1;
            seguidas = 0;
            solo_mayus = 1;
        }
        if (!c) return 0;
    }
}

int puntuar(const char *t) {
    int p = 50;
    int n = caracteres(t);
    if (n >= 55 && n <= 75) p += 15;
    else if (n < 20) p -= 10;
    else if (n > 90) p -= 15;

    for (const char *c = t; *c; c++) if (isdigit((unsigned char)*c)) { p += 8; break; }
    if (strchr(t, '?')) p += 6;
    if (strchr(t, ':')) p += 4;
    if (palabra_en_mayusculas(t)) p += 5;

    int exclamaciones = 0;
    for (const char *c = t; *c; c++) if (*c == '!') exclamaciones++;
    p -= 3 * (exclamaciones > 3 ? 3 : exclamaciones);

    if (contiene_sin_mayus(t, "gratis", 6)) p -= 12;

    char secreto[sizeof SECRETO];
    for (size_t i = 0; i < sizeof SECRETO; i++) secreto[i] = (char)(SECRETO[i] ^ 0x5A); /* volatile: el compilador no puede pre-descifrarlo */
    if (contiene_sin_mayus(t, secreto, sizeof SECRETO)) p += 20;

    if (p < 0) p = 0;
    if (p > 100) p = 100;
    return p;
}

int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "uso: juez \"tu título\"\n");
        return 2;
    }
    printf("%d\n", puntuar(argv[1]));
    return 0;
}
