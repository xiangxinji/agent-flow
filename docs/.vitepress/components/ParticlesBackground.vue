<script setup lang="ts">
import { onMounted, ref } from 'vue'

const particlesContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!particlesContainer.value) return
  
  try {
    const { tsParticles } = await import('@tsparticles/engine')
    const { loadSlim } = await import('@tsparticles/slim')
    
    await loadSlim(tsParticles)
    
    await tsParticles.load({
      id: 'tsparticles',
      options: {
        fullScreen: false,
        background: {
          color: {
            value: 'transparent'
          }
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push'
            },
            onHover: {
              enable: true,
              mode: 'grab'
            },
            resize: true
          },
          modes: {
            push: {
              quantity: 6
            },
            grab: {
              distance: 200,
              links: {
                opacity: 0.8,
                color: '#00d4ff'
              }
            },
            repulse: {
              distance: 100,
              duration: 0.4
            }
          }
        },
        particles: {
          color: {
            value: ['#00d4ff', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
          },
          links: {
            color: '#00d4ff',
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1.5,
            triangles: {
              enable: true,
              opacity: 0.05
            }
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce'
            },
            random: true,
            speed: 1.5,
            straight: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          number: {
            density: {
              enable: true,
              area: 600,
              factor: 1000
            },
            value: 120
          },
          opacity: {
            value: {
              min: 0.2,
              max: 0.8
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false
            }
          },
          shape: {
            type: ['circle', 'triangle', 'polygon'],
            options: {
              polygon: {
                sides: 6
              }
            }
          },
          size: {
            value: {
              min: 1,
              max: 5
            },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 0.5,
              sync: false
            }
          },
          life: {
            duration: {
              value: 10
            },
            count: 1
          }
        },
        detectRetina: true,
        motion: {
          disable: false,
          reduce: {
            factor: 4,
            value: true
          }
        }
      }
    })
  } catch (error) {
    console.warn('Failed to load particles:', error)
  }
})
</script>

<template>
  <div ref="particlesContainer" id="tsparticles" class="particles-container"></div>
</template>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

:deep(#tsparticles) {
  pointer-events: auto;
}

@media (max-width: 768px) {
  .particles-container {
    display: none;
  }
}
</style>
