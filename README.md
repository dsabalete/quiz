Página del proyecto Quiz (versión Raspbian)


Añadir a cada pregunta un índice temático
 

Se pide añadir un índice temático a cada pregunta introducida que diga si es una pregunta relativa a Humanidades, Ocio, Ciencia o Tecnología.

Para implementar esta funcionalidad habrá que  actualizar el modelo, introduciendo este nuevo campo en la tabla "Quiz" de preguntas. Además habra que que actualizar los controladores y las vistas afectados por este cambio.

Se recomienda utilizar el elemento <select> de HTML en los formularios de creación y edición para enviar parámetros de una lista preseleccionada:
<select name="tema">
  <option value="otro" selected>Otro</option>
  <option value="humanidades">Humanidades</option>
  <option value="ocio">Ocio</option>
  <option value="ciencia">Ciencia</option>
  <option value="tecnologia">Tecnología</option>
</select>
 
Una vez realizada, se deberá guardar una nueva versión (commit) con esta funcionalidad, la cual se desplegará en heroku y se subirá a GitHub.
