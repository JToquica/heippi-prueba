# PRUEBA - HEIPPI
## PRESENTADA POR: José Toquica

## LINK BASE URL: https://heippi-prueba-production.up.railway.app/api

### PD: Para usarlo se debe concatenar el url base + peticion.

## PETICIONES: 
### USUARIO:

#### - (POST) Registrar Usuario: /auth/register
#### Parametros:
    identificacion: String,
    nombre: String,
    email: String,
    clave: String,
    telefono: String,
    direccion: String,
    tipoUsuario: String,
    fechaNacimiento: String

#### Ejemplo: 
```bash 
{
    "identificacion": "1007865127",
    "nombre": "Juan Perez",
    "email": "test-account@hotmail.com",
    "clave": "1234567",
    "telefono": "32045455012",
    "direccion": "Cra 1B # 1-23",
    "tipoUsuario": "Paciente",
    "fechaNacimiento": "01-01-1990"
}
```


#### - (POST) Registrar Hospital: /auth/register
#### Parametros:
    identificacion: String,
    nombre: String,
    email: String,
    clave: String,
    telefono: String,
    direccion: String,
    tipoUsuario: String,
    serviciosMedicos: Array[String]

#### Ejemplo: 
```bash 
{
    "identificacion": "1007865128",
    "nombre": "Hospital San Vicente",
    "email": "test-account@gmail.com",
    "clave": "1234567",
    "telefono": "3209595123",
    "direccion": "Cra 1B # 2-34",
    "tipoUsuario": "Hospital",
    "serviciosMedicos": ["Servicio de Medicina General", "Servicio de Urgencias", "Radiografias"]
}
```


#### - (POST) Registrar Medico: /auth/register/medico
#### PD: Se requiere iniciar sesión con usuario de tipo Hospital y enviar el token en header("Bearer token")
#### Parametros:
    identificacion: String,
    nombre: String,
    email: String,
    clave: String,
    telefono: String,
    direccion: String,
    tipoUsuario: String,
    fechaNacimiento: String

Ejemplo: 
```bash 
{
    "identificacion": "1007865126",
    "nombre": "Juan Medico",
    "email": "test-account@hotmail.com",
    "clave": "1234567",
    "telefono": "3209595123",
    "direccion": "Cra 1B # 1-23",
    "tipoUsuario": "Medico",
    "fechaNacimiento": "01-01-1990"
}
```

#### - (POST) Iniciar Sesión: /auth/login
#### Parametros:
    identificacion: String,
    clave: String

#### Ejemplo: 
```bash 
{
    "identificacion": "1007865123",
    "clave": "12345678"
}
```

#### - (POST) Solicitar Verificación: /auth/request-verification
#### PD: Envia un correo con el link de verificación
#### Parametros:
    identificacion: String

#### Ejemplo: 
```bash 
{
    "identificacion": "1007865123"
}
```

#### - (POST) Solicitar Restablecimiento de Clave: /auth/forgot-password
#### PD: Envia un correo con el link de restablecimiento de la clave
#### Parametros:
    identificacion: String

#### Ejemplo: 
```bash 
{
    "identificacion": "1007865123"
}
```

#### - (PUT) Solicitar Restablecimiento de Clave: /auth/reset-password/token
#### PD: Se reemplaza la palabra token en el path variable por el token del usuario
#### Parametros:
    clave: String

#### Ejemplo: 
```bash 
{
    "clave": "1007865123"
}
```

### OBSERVACIONES:

#### - (POST) Registrar Observación: /observacion/create
#### PD: Se debe iniciar sesión como medico y se envia el token en el header("Bearer token")
#### Parametros:
    observacion: String,
    estadoSalud: String,
    especialidadMedica: String,
    idPaciente: String
    
#### Ejemplo: 
```bash 
{
    "observacion": "Todo Bien",
    "estadoSalud": "Muy Bien",
    "especialidadMedica": "Oftometria",
    "idPaciente": "63fb71d4ba5426ad86b8332f"
}
```

#### - (GET) Obtener Observaciones Paciente: /observacion
#### PD: Se debe iniciar sesión como Paciente y se envia el token en el header("Bearer token")

#### - (GET) Obtener Observaciones por Medico: /observacion/medico
#### PD: Se debe iniciar sesión como Medico y se envia el token en el header("Bearer token")

#### - (GET) Obtener Observaciones por Hospital: /observacion/hospital
#### PD: Se debe iniciar sesión como Hospital y se envia el token en el header("Bearer token")

#### - (GET) Generar Reporte: /observacion/generar-reporte/id
#### PD: Se reemplaza la palabra id en el path variable por la identificacion del usuario
