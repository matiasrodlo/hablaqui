# Component Library

## Overview
// This document provides detailed information about the reusable components used in the Hablaquí frontend application.

## Common Components

### AppbarBlue
// A blue navigation bar component used for the main application header.

#### Props
```typescript
interface AppbarBlueProps {
  title: string; // The title to display in the app bar
  showBack?: boolean; // Whether to show the back button
  showMenu?: boolean; // Whether to show the menu button
  onBack?: () => void; // Callback when back button is clicked
  onMenu?: () => void; // Callback when menu button is clicked
}
```

#### Usage
```vue
<template>
  <AppbarBlue
    title="Dashboard" // Main title of the page
    :showBack="true" // Enable back button
    :showMenu="true" // Enable menu button
    @back="handleBack" // Handle back navigation
    @menu="handleMenu" // Handle menu toggle
  />
</template>
```

### Avatar
// A circular avatar component for user and specialist profiles.

#### Props
```typescript
interface AvatarProps {
  src: string; // URL of the avatar image
  alt: string; // Alt text for accessibility
  size?: 'small' | 'medium' | 'large'; // Size variant
  fallback?: string; // Fallback image URL
}
```

#### Usage
```vue
<template>
  <Avatar
    src="/images/profile.jpg" // Profile image URL
    alt="User Profile" // Accessibility text
    size="medium" // Medium-sized avatar
    fallback="/images/default-avatar.png" // Default image
  />
</template>
```

### Calendar
// An appointment scheduling calendar component.

#### Props
```typescript
interface CalendarProps {
  selectedDate: Date; // Currently selected date
  availableSlots: TimeSlot[]; // Available time slots
  onDateSelect: (date: Date) => void; // Date selection handler
  onSlotSelect: (slot: TimeSlot) => void; // Time slot selection handler
}
```

#### Usage
```vue
<template>
  <Calendar
    :selectedDate="selectedDate" // Current selection
    :availableSlots="slots" // Available times
    @dateSelect="handleDateSelect" // Handle date change
    @slotSelect="handleSlotSelect" // Handle slot selection
  />
</template>
```

## Layout Components

### DefaultLayout
// The default layout component with header, footer, and main content area.

#### Props
```typescript
interface DefaultLayoutProps {
  showHeader?: boolean; // Toggle header visibility
  showFooter?: boolean; // Toggle footer visibility
  headerTitle?: string; // Header title text
}
```

#### Usage
```vue
<template>
  <DefaultLayout
    :showHeader="true" // Show the header
    :showFooter="true" // Show the footer
    headerTitle="Home" // Set header title
  >
    <template #content>
      <!-- Main content -->
    </template>
  </DefaultLayout>
</template>
```

## Feature Components

### AppointmentForm
// A form component for scheduling appointments.

#### Props
```typescript
interface AppointmentFormProps {
  specialistId: string; // ID of the selected specialist
  availableDates: Date[]; // Available dates for booking
  onSubmit: (data: AppointmentData) => void; // Form submission handler
  onCancel: () => void; // Cancel action handler
}
```

#### Usage
```vue
<template>
  <AppointmentForm
    :specialistId="specialist.id" // Selected specialist
    :availableDates="dates" // Available dates
    @submit="handleSubmit" // Handle form submission
    @cancel="handleCancel" // Handle cancellation
  />
</template>
```

### ChatInterface
// A real-time chat interface component.

#### Props
```typescript
interface ChatInterfaceProps {
  roomId: string; // Chat room identifier
  userId: string; // Current user's ID
  messages: Message[]; // Chat messages
  onSend: (message: string) => void; // Message send handler
  onTyping: () => void; // Typing indicator handler
}
```

#### Usage
```vue
<template>
  <ChatInterface
    :roomId="chatRoom.id" // Chat room ID
    :userId="currentUser.id" // Current user ID
    :messages="messages" // Chat messages
    @send="handleSend" // Handle message sending
    @typing="handleTyping" // Handle typing status
  />
</template>
```

## State Management

### Component State
// Components use Vuex for state management. Each component can access the store using mapState, mapGetters, mapActions, and mapMutations.

#### Example
```vue
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      user: state => state.user, // User state
      appointments: state => state.appointments // Appointments state
    })
  },
  methods: {
    ...mapActions([
      'fetchUser', // Fetch user data
      'createAppointment' // Create new appointment
    ])
  }
};
</script>
```

## Styling

### Theme
// Components use the application's theme variables for consistent styling.

#### Variables
```scss
// Colors
$primary: #2196F3; // Primary brand color
$secondary: #FFC107; // Secondary brand color
$success: #4CAF50; // Success state color
$error: #F44336; // Error state color

// Typography
$font-family: 'Roboto', sans-serif; // Main font family
$font-size-base: 16px; // Base font size
$line-height-base: 1.5; // Base line height

// Spacing
$spacing-unit: 8px; // Base spacing unit
$spacing-small: $spacing-unit; // Small spacing
$spacing-medium: $spacing-unit * 2; // Medium spacing
$spacing-large: $spacing-unit * 3; // Large spacing
```

### Responsive Design
// Components are built with a mobile-first approach and use breakpoints for responsive layouts.

#### Breakpoints
```scss
$breakpoints: (
  'small': 576px, // Mobile devices
  'medium': 768px, // Tablets
  'large': 992px, // Small desktops
  'xlarge': 1200px // Large desktops
);
```

## Accessibility

### ARIA Labels
// Components include proper ARIA labels for screen readers.

#### Example
```vue
<template>
  <button
    aria-label="Close dialog" // Screen reader text
    @click="handleClose" // Click handler
  >
    <Icon name="close" />
  </button>
</template>
```

### Keyboard Navigation
// Components support keyboard navigation for better accessibility.

#### Example
```vue
<template>
  <div
    tabindex="0" // Make div focusable
    @keydown.enter="handleSelect" // Handle enter key
    @keydown.space="handleSelect" // Handle space key
  >
    <!-- Content -->
  </div>
</template>
```

## Testing

### Unit Tests
// Components include unit tests for functionality and props.

#### Example
```javascript
import { mount } from '@vue/test-utils';
import AppbarBlue from './AppbarBlue.vue';

describe('AppbarBlue', () => {
  it('renders title prop', () => {
    const wrapper = mount(AppbarBlue, {
      propsData: {
        title: 'Test Title' // Test title prop
      }
    });
    expect(wrapper.text()).toContain('Test Title'); // Verify title
  });
});
```

### Integration Tests
// Components are tested in integration with other components.

#### Example
```javascript
import { mount } from '@vue/test-utils';
import AppointmentForm from './AppointmentForm.vue';
import Calendar from './Calendar.vue';

describe('AppointmentForm', () => {
  it('integrates with Calendar component', () => {
    const wrapper = mount(AppointmentForm);
    expect(wrapper.findComponent(Calendar).exists()).toBe(true); // Verify Calendar integration
  });
});
```

## Performance

### Optimization
// Components are optimized for performance using:
- Lazy loading // Load components on demand
- Code splitting // Split code into chunks
- Memoization // Cache computed values
- Virtual scrolling // Optimize long lists

### Best Practices
// Component development guidelines
- Keep components small and focused // Single responsibility
- Use computed properties for derived data // Performance optimization
- Implement proper error boundaries // Error handling
- Optimize re-renders // Performance improvement

## Support
// Support information
For component support, please contact the development team or create an issue in the repository. 