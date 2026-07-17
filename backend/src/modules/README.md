# Módulos (Backend)

Cada _feature_ del sistema vive en su propia carpeta dentro de `modules/` y es
autocontenida. Módulos previstos:

`auth` · `users` · `drivers` · `passengers` · `vehicles` · `routes` · `trips` ·
`requests` · `notifications`

## Estructura estándar de un módulo

```
modules/<modulo>/
├── <modulo>.routes.ts       # Define los endpoints y los conecta al controller
├── <modulo>.controller.ts   # Recibe req/res, delega en el service (sin lógica de negocio)
├── <modulo>.service.ts      # Lógica de negocio / casos de uso
├── <modulo>.repository.ts   # Acceso a datos vía Prisma
├── <modulo>.dto.ts          # Esquemas de validación (Zod) y tipos de entrada/salida
└── <modulo>.types.ts        # Tipos internos del módulo (opcional)
```

## Flujo dentro de un módulo

```
Router → Controller → Service → Repository → Prisma → PostgreSQL
```

Esta separación aplica el Principio de Responsabilidad Única (SRP) y mantiene el
código desacoplado y fácil de probar. **Aún no se ha implementado ningún módulo.**
