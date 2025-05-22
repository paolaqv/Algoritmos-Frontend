import gsap from "gsap";

/**
 * @param criticalPath 
 */
export function animateGraphCriticalPath(criticalPath: string[]): void {
  const tl = gsap.timeline({ repeat: 0 });

  criticalPath.forEach((nodeName, index) => {
    // Selecciona el nodo a animar
    const nodeEl = document.getElementById(`node-${nodeName}`);
    if (nodeEl) {
      // Primero, se aumenta la escala y se cambia el color del nodo (el color se queda en ese nodo)
      tl.to(nodeEl, {
        scale: 1.5,
        backgroundColor: "#d15913", 
        duration: 0.5,
        ease: "power1.inOut"
      });
      tl.to(nodeEl, {
        scale: 1,
        duration: 0.5,
        ease: "power1.inOut"
      });
    }
    if (index < criticalPath.length - 1) {
      const nextNodeName = criticalPath[index + 1];
      const groupId = `edge-${nodeName}-${nextNodeName}`;
      const edgeGroup = document.getElementById(groupId);
      if (edgeGroup) {
        const pathEl = edgeGroup.querySelector("path");
        if (pathEl) {
          tl.to(pathEl, {
            attr: { stroke: "#f25424" }, 
            color: "#f25424",            
            duration: 0.5,
            ease: "power1.inOut"
          });
        }
      }
    }
  });

  tl.call(adjustPopupToGraph);
}


function adjustPopupToGraph(): void {
  const graphContainer = document.getElementById('graph');
  const popupEl = document.querySelector('.popup-content') as HTMLElement;
  if (graphContainer && popupEl) {
    const graphRect = graphContainer.getBoundingClientRect();
    gsap.to(popupEl, {
      width: graphRect.width + 40, 
      height: graphRect.height + 40,
      duration: 0.5,
      ease: "power1.inOut"
    });
  }
}
