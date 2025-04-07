import gsap from "gsap";

/**
 * Anima la ruta crítica en el grafo y deja todos los nodos y aristas con el color highlight al terminar.
 * @param criticalPath - Arreglo de nombres de nodos de la ruta crítica (ej. ["a", "b", "d", "f", "g"]).
 */
export function animateGraphCriticalPath(criticalPath: string[]): void {
  // Creamos una línea de tiempo sin repetición para dejar el estado final.
  const tl = gsap.timeline({ repeat: 0 });

  criticalPath.forEach((nodeName, index) => {
    // Animación para el nodo: se aumenta la escala y se cambia el color al highlight, y se queda así.
    const nodeEl = document.getElementById(`node-${nodeName}`);
    if (nodeEl) {
      tl.to(nodeEl, {
        scale: 1.5,
        backgroundColor: "#d15913", // Color highlight para nodo (por ejemplo, naranja rojizo)
        duration: 0.5,
        ease: "power1.inOut"
      });
    }
    // Si hay un nodo siguiente, animar la arista que los conecta
    if (index < criticalPath.length - 1) {
      const groupId = `edge-${criticalPath[index]}-${criticalPath[index + 1]}`;
      const edgeGroup = document.getElementById(groupId);
      if (edgeGroup) {
        // Seleccionamos el <path> que dibuja la arista dentro del grupo
        const pathEl = edgeGroup.querySelector("path");
        if (pathEl) {
          tl.to(pathEl, {
            attr: { stroke: "#f25424" }, // Color highlight para arista (por ejemplo, un tono cálido)
            color: "#f25424",            // Animamos la propiedad 'color' para que el marker (si se usa) herede este color
            duration: 0.5,
            ease: "power1.inOut"
          });
        }
      }
    }
  });
}
