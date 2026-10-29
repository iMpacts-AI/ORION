/**
 * ORION Unified Test Runner Entrypoint
 * Delegates directly to run_suites.cjs so all test entrypoints execute in pure process isolation
 * with accurate pass/fail/skipped reporting.
 */
require('./run_suites.cjs');
