# Mis 15 — Zaira 🎉

Invitación digital para los 15 años de Zaira. Sitio estático (HTML/CSS/JS puro),
sin necesidad de instalar nada ni tener conocimientos de programación para
editar los datos del evento.

## 1. Cómo publicarla en GitHub Pages

1. Creá un repositorio nuevo en GitHub y subí **todo** el contenido de esta
   carpeta (que `index.html` quede en la raíz del repo, no dentro de otra
   carpeta).
2. En el repositorio: **Settings → Pages → Branch** → elegí `main` (o la que
   uses) y carpeta `/ (root)` → **Save**.
3. GitHub te va a dar un link tipo `https://tuusuario.github.io/nombre-repo/`
   en un par de minutos. Ese es el link para compartir.

No hace falta configurar nada más — el archivo `.nojekyll` ya está incluido
para que GitHub sirva todo tal cual, sin procesarlo.

## 2. Cómo editar los datos del evento (sin tocar código)

Abrí el archivo **`script.js`** con cualquier editor de texto (hasta el Bloc
de notas sirve) y mirá arriba de todo el bloque `CONFIG`. Ahí está **todo**
lo que se puede cambiar sin romper nada:

| Campo | Qué es |
|---|---|
| `nombre` | Nombre de la cumpleañera |
| `fechaISO` | Fecha y hora en formato `AAAA-MM-DDTHH:MM:SS` (la usa la cuenta regresiva) |
| `fecha` / `hora` | El texto que se muestra en pantalla |
| `duracionHoras` | Duración estimada del evento (para el botón "Agregar al calendario") |
| `lugar` / `direccion` | Nombre del salón y dirección completa |
| `maps` | Link de Google Maps del lugar |
| `googleFormUrl` | Link de tu formulario de Google para confirmar asistencia |
| `instagram` | Usuario de Instagram (dejar `""` para ocultar el botón) |
| `dressCode` | Código de vestimenta |

Guardás el archivo, volvés a subirlo al repositorio (o lo reemplazás en
GitHub directamente, se puede editar ahí mismo con el lápiz ✏️) y listo, los
cambios se ven solos.

## 3. Cómo cambiar las fotos

Reemplazá los archivos dentro de la carpeta `assets/` **manteniendo el mismo
nombre**:

- `zaira.jpg` → foto principal (aparece de fondo en toda la web)
- `foto1.jpg` a `foto6.jpg` → galería y fondo animado

Para que la web siga cargando rápido, subí las fotos ya comprimidas
(idealmente menos de 300 KB cada una — cualquier compresor de imágenes
gratuito online sirve).

## 4. Música de fondo

El reproductor ya está armado (botón de silenciar arriba a la derecha, con
loop automático). Para activarlo, agregá un archivo llamado **`musica.mp3`**
dentro de `assets/`. Importante: usá una pista sobre la que tengas
autorización de uso (comprada, con licencia, o libre de derechos) — al ser
un sitio público, no se puede usar música con copyright sin permiso.

Si no agregás el archivo, el botón simplemente no aparece, no rompe nada.

## 5. Formulario de confirmación de asistencia

El botón "Confirmar asistencia" abre tu formulario de Google Forms. Para
armar el conteo de invitados:

1. Creá el formulario en [forms.google.com](https://forms.google.com) con
   los campos que quieras (nombre y apellido, ¿asiste sí/no?, cantidad de
   acompañantes, etc.).
2. Copiá el link de "Enviar" y pegalo en `CONFIG.googleFormUrl`.
3. En la pestaña **Respuestas** de Google Forms vas a ver el resumen
   automático (cuántos confirmaron sí/no) y podés exportar todo a una
   planilla de Google Sheets con un clic.

## 6. Estructura de archivos

```
index.html      → estructura de la página
style.css       → todos los estilos y animaciones
script.js       → CONFIG (datos editables) + toda la lógica
assets/         → fotos (y música, si la agregás)
.nojekyll       → necesario para que GitHub Pages sirva el sitio sin errores
```

---
Hecho con cariño para los 15 de Zaira. 🤍
