# Mini app de testing 

Esta es una tonta y pequeña **aplicación de demostración** desarrollada para experimentar con **pipelines CI/CD** y **flujos GitOps** desplegándola en múltiples plataformas: **Docker**, **Docker Compose**, **máquinas virtuales**, y **Kubernetes** (AKS, GKE, EKS, etc.).  


## ¿Para qué uso esta app?
- Probar CICD (por ej; **build → deploy → smoke test**) en distintos entornos.
- Experimentar con **GitOps** 
- validar algunos modos de exposición de una aplicación
  + **Web server / Reverse proxy** (p. ej., Nginx/Apache)
  + **Kubernetes Ingress**
  + **NodePort / LoadBalancer**
  + **API Gateway** (p. ej., Kong/AGIC)

## Plataformas soportadas
- **Docker / Docker Compose**
- **Máquinas virtuales** (systemd/Docker/podman)
- **Kubernetes**: vanilla, **AKS**, **GKE**, **EKS**

## Ejecutar con Docker:
- `docker build -t holi .`
- `docker run --rm -d -p 8080:80 holi`