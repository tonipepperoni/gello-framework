/**
 * @gello/auth
 *
 * Complete authentication and authorization system for Gello.
 *
 * This package re-exports all auth packages for convenient access.
 */

// Core - Types, errors, services
export * from "@gello/auth-core"

// Session - Session management, JWT, CSRF
export * from "@gello/auth-session"

// Authorization - CASL-style abilities
export * from "@gello/auth-authorization"

// Social - OAuth providers
export * from "@gello/auth-social"

// Templates - Pre-built email templates
export * from "@gello/auth-templates"

// Testing - Mock implementations and test utilities
export * from "@gello/auth-testing"
