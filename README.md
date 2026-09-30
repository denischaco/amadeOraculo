# 🔮 El Oráculo Albiazul

> **Una idea y desarrollo de la Filial Chaco T "Nery Leyes"**  
> *"La grandeza de Talleres no se mide solo en copas, sino en la memoria viva de su gente."*

---

## 🌟 ¿Qué es El Oráculo Albiazul?

**El Oráculo Albiazul** es una experiencia interactiva tipo *Tinder/Swipe* diseñada para hinchas del Club Atlético Talleres. A través de un mazo de cartas con 27 ídolos y figuras trascendentales de la historia albiazul (desde la era dorada de los años 70 de Don Amadeo hasta la actualidad y las hazañas de Las Matadoras), el usuario indica para cada jugador:

- 🏟️ **¡En Cancha!** (Swipe a la derecha / Flecha Derecha)
- 📺 **Lo vi en video** (Swipe hacia arriba / Flecha Arriba)
- ❓ **Ni lo juno** (Swipe a la izquierda / Flecha Izquierda)

Al solicitar la **"Parada Cordobesa"** (a partir del 5to jugador) o finalizar el mazo, **Don Amadeo en persona** devuelve un veredicto personalizado analizando el ADN del hincha, un desglose jugador por jugador, sugerencias directas de Google y un prompt generado para profundizar en Inteligencia Artificial.

---

## ✨ Características Principales

- **Diseño Adaptativo (Mobile-First y Desktop Wide):**
  - Mazo vertical centrado óptimo para celulares y pantallas táctiles.
  - En Desktop: soporte completo de navegación por teclado (`⬅️`, `⬆️`, `➡️`, `Espacio/Enter`) y pantalla de veredicto en tríptico responsive a 3 columnas.
- **Identidad Institucional Filial Chaco:**
  - Escudo oficial de la Filial Chaco T incorporado.
  - Fondo tramado en mosaico tenue con el imagotipo oficial.
- **Rendimiento Ultrarrápido (100% Offline/Local):**
  - Todas las 27 fotos de los ídolos optimizadas y alojadas localmente en `/imagenes/fotos_idolos/`, sin latencia de red ni enlaces caídos.
- **Reconocimiento Histórico a Las Matadoras:**
  - Florencia Pianello (máxima goleadora histórica con +150 goles) y Eliana Capdevila (artillera del ascenso 2024 a Primera A).
  - Veredicto pedagógico, consultas prioritarias de Google y consigna en el prompt de IA para reivindicar el fútbol femenino.
- **Efectos de Sonido Web Audio:**
  - Sintetizador de tonos nativo sin librerías externas pesadas.

---

## 🚀 Cómo Ejecutar Localmente

### Requisitos
- [Node.js](https://nodejs.org/) (versión 14 o superior)

### Instalación y Ejecución
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/denischaco/amadeOraculo.git
   cd amadeOraculo
   ```

2. Iniciar el servidor local:
   ```bash
   npm start
   ```

3. Abrir en el navegador:
   - **En tu PC:** [http://localhost:3000](http://localhost:3000)
   - **En tu celular (misma red Wi-Fi):** La consola indicará la IP local (ej. `http://192.168.0.x:3000`)

---

## 📂 Estructura del Proyecto

```text
├── el_or_culo_albiazul.html   # Aplicación principal interactiva
├── index.html                 # Punto de entrada / redirección
├── idolos.json                # Base de datos de 27 ídolos albiazules
├── server.js                  # Servidor HTTP Node.js multi-dispositivo
├── package.json               # Configuración del proyecto
└── imagenes/
    ├── logo_filial_chaco.png  # Escudo oficial transparente
    ├── trama_filial_chaco.png # Mosaico de fondo
    ├── Amadeo1.jpg            # Retrato aplausos
    ├── Amadeo2.jpg            # Retrato pulgar arriba
    ├── Amadeo3.jpg            # Retrato pedagógico
    └── fotos_idolos/          # 27 fotografías optimizadas de ídolos
```

---

## 💙 Créditos y Comunidad

Desarrollado con pasión albiazul por la **Filial Chaco T "Nery Leyes"**.  
Seguinos en Instagram: [@talleresfilialchaco](https://www.instagram.com/talleresfilialchaco)
