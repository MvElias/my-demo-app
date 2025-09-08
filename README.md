# Mini app de testing 

Necesitaba experimentar con **pipelines CI/CD** y **flujos GitOps** desplegando en múltiples plataformas: **Docker**, **Docker Compose**, **máquinas virtuales**, y **Kubernetes** (AKS, GKE, EKS, etc.) por lo que desarrollé está **aplicación de demostración**. 


## ¿Para qué uso esta app?
- Probar CICD (por ej; **build → deploy → smoke test**) en distintos entornos.
- Experimentar con **GitOps** 
- validar otras cosas tras desplegar, como por ejemplo:
  + **Web server / Reverse proxy** (p. ej., Nginx/Apache)
  + **Kubernetes Ingress**
  + **NodePort / LoadBalancer**
  + **API Gateway** (p. ej., Kong/AGIC)

## Plataformas soportadas
- **Docker / Docker Compose**
- **Máquinas virtuales** (systemd/Docker/podman)
- **Kubernetes**: vanilla, **AKS**, **GKE**, **EKS**

## Ejecutar con Docker:
- `docker build -t seal .`
- `docker run --rm -d -p 8080:80 seal`