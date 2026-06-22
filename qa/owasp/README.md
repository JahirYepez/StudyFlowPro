# OWASP ZAP - StudyFlowPro

Esta carpeta esta pensada para guardar evidencias generadas por OWASP ZAP.

Para un escaneo basico no es necesario configurar certificado. Basta con usar:

```text
Quick Start > Automated Scan
```

URLs sugeridas:

```text
https://study-flow-pro-kappa.vercel.app/
https://studyflowpro-api.onrender.com/docs
https://studyflowpro-api.onrender.com/openapi.json
```

Al terminar, generar el reporte desde:

```text
Report > Generate Report
```

El certificado de ZAP solo seria necesario si se quiere interceptar manualmente
el trafico HTTPS del navegador usando ZAP como proxy.
