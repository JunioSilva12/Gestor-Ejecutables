// src/plugins/primevue.js
import Material from '@primevue/themes/material'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'

const ArgusPreset = definePreset(Material, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: '#F0F9FF',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',     // secondary
          500: '#0C4A6E',     // primary
          600: '#0A3D59',
          700: '#082F44',
          800: '#06212F',
          900: '#04131A',
          950: '#020A0D'
        },

        colorScheme: {
          primary: {
            50: '{primary.50}',
            100: '{primary.100}',
            200: '{primary.200}',
            300: '{primary.300}',
            400: '{primary.400}',
            500: '{primary.500}',
            600: '{primary.600}',
            700: '{primary.700}',
            800: '{primary.800}',
            900: '{primary.900}',
            950: '{primary.950}',
          },
          slate: {
            50: '#F1F5F9',   // background
            100: '#E5E7EB',  // background-second
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#020617'
          }
        },

        semantic: {
          primary: {
            50: '{primary.50}',
            100: '{primary.100}',
            200: '{primary.200}',
            300: '{primary.300}',
            400: '{primary.400}',
            500: '{primary.500}',
            600: '{primary.600}',
            700: '{primary.700}',
            800: '{primary.800}',
            900: '{primary.900}',
            950: '{primary.950}'
          },
          color: {
            primary: '{primary.500}',
            primaryContrast: '#FFFFFF',
            secondary: '{primary.400}',
            secondaryContrast: '#FFFFFF',

            surface: '#FFFFFF',
            surfaceHover: '#F1F5F9',
            surfaceActive: '#E5E7EB',
            surfaceContrast: '#0F172A',
            surfaceCard: '#FFFFFF',

            text: '#0F172A',
            textHover: '#082F44',
            textMuted: '#64748B',
            textDisabled: '#94A3B8',

            border: '#BAE6FD',
            borderHover: '#7DD3FC',
            borderActive: '{primary.500}',

            focusRing: '{primary.500}',

            highlight: '#F0F9FF',
            highlightContrast: '#0F172A'
          }
        }
      },

      /* DARK MODE */
      dark: {
        primary: {
          50: '#F0F9FF',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0C4A6E',
          600: '#0A3D59',
          700: '#082F44',
          800: '#06212F',
          900: '#04131A',
          950: '#020A0D'
        },

        colorScheme: {
          primary: {
            50: '{primary.50}',
            100: '{primary.100}',
            200: '{primary.200}',
            300: '{primary.300}',
            400: '{primary.400}',
            500: '{primary.500}',
            600: '{primary.600}',
            700: '{primary.700}',
            800: '{primary.800}',
            900: '{primary.900}',
            950: '{primary.950}',
          },
          slate: {
            50: '#020617',
            100: '#0F172A',
            200: '#1E293B',
            300: '#334155',
            400: '#475569',
            500: '#64748B',
            600: '#94A3B8',
            700: '#CBD5E1',
            800: '#E2E8F0',
            900: '#F1F5F9',
            950: '#F8FAFC'
          }
        },

        semantic: {
          primary: {
            50: '{primary.50}',
            100: '{primary.100}',
            200: '{primary.200}',
            300: '{primary.300}',
            400: '{primary.400}',
            500: '{primary.500}',
            600: '{primary.600}',
            700: '{primary.700}',
            800: '{primary.800}',
            900: '{primary.900}',
            950: '{primary.950}'
          },
          color: {
            primary: '{primary.400}',
            primaryContrast: '#000000',
            secondary: '{slate.400}',
            secondaryContrast: '#000000',

            surface: '#0F172A',
            surfaceHover: '#1E293B',
            surfaceActive: '#334155',
            surfaceContrast: '#FFFFFF',
            surfaceCard: '#1E293B',

            text: '#F1F5F9',
            textHover: '#FFFFFF',
            textMuted: '#CBD5E1',
            textDisabled: '#64748B',

            border: '#334155',
            borderHover: '#475569',
            borderActive: '{primary.400}',

            focusRing: '{primary.400}',

            highlight: 'rgba(255, 255, 255, 0.16)',
            highlightContrast: 'rgba(255, 255, 255, 0.87)'
          }
        }
      }
    }
  },

  /* COMPONENT STYLE OVERRIDES */
  components: {
 
    button: {
      root: {
        borderRadius: '8px',
        fontWeight: '500'
      }
    },
    card: {
      root: {
        borderRadius: '12px',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }
    },
    inputtext: {
      root: {
        borderRadius: '8px'
      }
    },
    menu: {
      root: {
        borderRadius: '8px'
      }
    },
    dialog: {
      root: {
        borderRadius: '12px'
      }
    }
  }
});

export default ArgusPreset;
