# Nestara Live Monitor

## Overview

Nestara is a neonatal transport platform designed to set the safety benchmark in neonatal care by monitoring critical physical conditions during intra-hospital transport and inter-facility transfers. The system monitors two primary risks: overheating (thermal instability) and shaking/shock exposure (vibration instability) for premature and critically ill infants under 1 year old.

The platform consists of a React-based dashboard for hospital staff, mobile measurement tools, and hardware sensors that provide real-time monitoring of neonatal bed conditions. The system is designed to be HIPAA-compliant and integrate seamlessly with existing hospital workflows, particularly Microsoft Teams.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Medical-style layout format for both phone and desktop while retaining all application functionality.
UI style: Clean, minimal design with user-friendly colors and professional medical interface patterns.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Vite Build System**: Fast development and optimized production builds
- **Wouter Router**: Lightweight client-side routing
- **TanStack Query**: Server state management with caching and real-time updates
- **Tailwind CSS + shadcn/ui**: Utility-first styling with professional component library
- **Radix UI**: Accessible headless UI components as the foundation

### Backend Architecture
- **Express.js with TypeScript**: RESTful API server with type safety
- **PostgreSQL with Drizzle ORM**: Relational database with type-safe queries
- **Session-based Authentication**: Express sessions with PostgreSQL storage
- **WebSocket Support**: Real-time data streaming for live monitoring
- **Security Middleware**: IP activity tracking and threat detection for HIPAA compliance

### Mobile Application
- **Progressive Web App**: Mobile-optimized web interface for shock measurement
- **Device Motion API**: Native accelerometer access for vibration/shock detection
- **Offline-capable**: Can function without constant network connectivity
- **HIPAA-compliant Data Handling**: Secure transmission and storage of measurement data

### Database Schema
- **Users**: Role-based authentication (director, head_nurse, assigned_nurse, nurse, tech_support, admin)
- **Units**: Physical neonatal beds with metadata (serial numbers, room assignments, maintenance schedules)
- **Telemetry**: Time-series sensor data (temperature readings, vibration measurements, battery levels)
- **Alerts**: Event-driven notifications with status tracking and assignment
- **Mobile Measurements**: Dedicated tables for mobile shock measurement sessions
- **Security Audit**: IP activity monitoring and threat detection logging

### Key Design Patterns
- **Context-based State Management**: React contexts for authentication and app settings
- **Protected Routes**: Authentication-gated navigation with role-based access
- **Real-time Updates**: 30-second polling intervals with WebSocket fallback
- **Responsive Design**: Mobile-first approach with touch-optimized interfaces
- **Component Composition**: Reusable UI components with consistent theming

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema migrations

### Authentication & Security
- **Passport.js**: Flexible authentication with local strategy
- **express-session**: Server-side session management
- **connect-pg-simple**: PostgreSQL session store integration
- **Security middleware**: Custom IP tracking and threat detection

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon system
- **Recharts**: Data visualization and charting

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production
- **Replit Plugins**: Development environment integration