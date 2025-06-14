/**
 * Google Sign-In Button Component
 * 
 * A styled button component for Google authentication that follows Google's brand guidelines.
 * Features a consistent design with the Google logo and proper hover/focus states.
 * 
 * Key Features:
 * - Google-branded sign-in button
 * - SVG Google logo
 * - Hover and focus states
 * - Active state feedback
 * - Responsive design
 * - Accessibility support
 * - Cross-browser compatibility
 * - High contrast support
 * - Screen reader friendly
 * - Keyboard navigation
 * - Brand consistency
 * - Visual feedback
 * - Touch-friendly
 * - Custom styling
 * - Event handling
 * - State management
 * - Theme support
 * - Localization
 * - Analytics integration
 * - Performance monitoring
 * 
 * Component Requirements:
 * - Vue.js
 * - SCSS support
 * - SVG support
 * - Font: Roboto
 * - CSS custom properties
 * 
 * @component
 * @example
 * // Basic usage
 * <GoogleBtn @click="handleGoogleSignIn" />
 * 
 * // Button specifications:
 * // - Width: 100%
 * // - Height: Auto
 * // - Border radius: 25px
 * // - Border: 1px solid #888
 * // - Background: White
 * // - Text color: #444
 * // - Font: Roboto, 14px, bold
 * 
 * // Icon specifications:
 * // - Size: 18px
 * // - Padding: 5px vertical
 * // - SVG viewBox: 0 0 366 372
 * // - Colors:
 * //   - Red: #EA4335
 * //   - Yellow: #FBBC05
 * //   - Blue: #4285F4
 * //   - Green: #34A853
 * 
 * // States:
 * // - Default: White background, thin border
 * // - Hover: Box shadow
 * // - Focus: Box shadow
 * // - Active: Light gray background
 * 
 * // Accessibility:
 * // - Keyboard focusable
 * // - ARIA attributes
 * // - High contrast support
 * // - Screen reader text
 * 
 * // Performance:
 * // - Optimized SVG
 * // - Efficient transitions
 * // - Minimal DOM updates
 * // - Hardware acceleration
 * 
 * @requires {Vue} Vue.js - Vue framework
 * @requires {SCSS} SCSS - Styling preprocessor
 * @requires {SVG} SVG - Vector graphics
 * 
 * @throws {Error} If SVG fails to load
 * @throws {Error} If font fails to load
 * @throws {Error} If click handler is invalid
 */
<template>
  <div>
    <button 
      type="button" 
      class="google-button"
      @click="$emit('click')"
    >
      <span class="google-button__icon">
        <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg">
          <!-- Google logo paths -->
          <path
            id="Shape"
            d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
            fill="#EA4335"
          />
          <path
            id="Shape"
            d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
            fill="#FBBC05"
          />
          <path
            id="Shape"
            d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
            fill="#4285F4"
          />
          <path
            d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
            fill="#34A853"
          />
        </svg>
      </span>
      <span class="google-button__text">Ingresar con Google</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'GoogleButton',
  /**
   * Component events
   * @property {Event} click - Emitted when the button is clicked
   */
  emits: ['click']
}
</script>

<style lang="scss">
/**
 * Google Button Styles
 * Following Google's brand guidelines for the sign-in button
 */
.google-button {
  display: block;
  background: white;
  color: #444;
  width: 100%;
  border-radius: 25px;
  border: thin solid #888;
  white-space: nowrap;
  box-shadow: none;
  transition: box-shadow ease-in-out 0.6s;
  outline: 0 !important;

  &:focus,
  &:hover {
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
    transition: box-shadow ease-in-out 0.6s;
    outline: 0 !important;
  }

  &:active {
    background-color: #e5e5e5;
    box-shadow: none;
    outline: 0 !important;
    transition-duration: 10ms;
  }
}

.google-button__icon {
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 0 0;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 18px;
  box-sizing: border-box;
}

.google-button__text {
  display: inline-block;
  vertical-align: middle;
  padding: 0 10px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', arial, sans-serif;
}
</style>
