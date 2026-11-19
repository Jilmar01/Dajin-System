# Dajin System — Sistema de Gestión de Activos Empresariales

Aplicación web empresarial para la gestión integral de inventario, ciclo de vida, asignación a custodios y control presupuestario de activos fijos y tecnológicos. Desarrollada con **Angular** e integrada mediante API REST y autenticación segura (JWT) con su [servicio backend en Spring Boot](https://github.com/Jilmar01/AssetManagement-Web).

## Descripción y Propósito

**Dajin System** centraliza la administración y auditoría de recursos empresariales (equipos de cómputo, servidores, mobiliario, vehículos y licencias) para organizaciones medianas y grandes, ofreciendo una interfaz ágil y orientada a la toma de decisiones:

- **Inventario Unificado:** Búsqueda rápida, filtrado avanzado y registro de activos mediante código patrimonial único y número de serie del fabricante.
- **Gestión del Ciclo de Vida:** Control interactivo de estados (`DISPONIBLE`, `ASIGNADO`, `EN_MANTENIMIENTO`, `DE_BAJA`) con validaciones en tiempo real para evitar inconsistencias operativas.
- **Control Presupuestario por Departamento:** Indicadores visuales y alertas que previenen adquisiciones que excedan el cupo asignado por área u oficina.
- **Soporte Multidivisa en Tiempo Real:** Visualización y cálculo automático en moneda base (USD) para activos cotizados en EUR, GBP u otras divisas internacionales.
- **Flujo de Asignaciones y Custodia:** Módulo dedicado para gestionar entregas y devoluciones a empleados, con generación y descarga de constancias de entrega.
- **Seguridad y Control de Acceso:** Gestión de sesiones, interceptores HTTP para tokens JWT y vistas protegidas según el rol del usuario.

## Stack Tecnológico

- **Framework:** Angular
- **Lenguaje:** TypeScript
- **Arquitectura e Integración:** Consumo de API REST (`HttpClient`), Interceptores HTTP y autenticación JWT
- **Backend asociado:** [AssetManagement-Web (Spring Boot / Java)](https://github.com/Dario7-ux/AssetManagement)