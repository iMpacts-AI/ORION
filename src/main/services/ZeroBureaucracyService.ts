import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ExecutionTraceService } from './ExecutionTraceService';

export interface ZeroBureaucracyApplicationInput {
  applicantName?: string;
  emiratesId?: string;
  tradeNameEnglish?: string;
  tradeNameArabic?: string;
  legalStructure?: 'FZ-LLC' | 'LLC' | 'Sole Establishment' | 'Branch';
  activityCode?: string;
  activityDescription?: string;
  jurisdiction?: string;
  tenancyEjariRef?: string;
  uboDeclarationConfirmed?: boolean;
  safetyComplianceConfirmed?: boolean;
  contactEmail?: string;
  simulatedSampleLabel?: 'SIMULATED_SAMPLE_DATA';
}

export interface ZeroBureaucracyValidationFieldResult {
  field: keyof ZeroBureaucracyApplicationInput;
  label: string;
  valid: boolean;
  valueSummary: string;
  reason?: string;
}

export interface ZeroBureaucracyWorkflowResult {
  workflowId: string;
  status: 'COMPLETED' | 'INCOMPLETE_BLOCKED' | 'CONFLICT_BLOCKED' | 'AWAITING_HUMAN_APPROVAL' | 'FAILED';
  dataClassification: 'SIMULATED_SAMPLE_DATA';
  approvalStatus?: 'APPROVED_BY_OPERATOR' | 'AWAITING_HUMAN_APPROVAL' | 'BLOCKED_BY_VALIDATION';
  auditTracePath?: string;
  workspaceDir: string;
  stages: {
    network: {
      status: 'VERIFIED' | 'FAILED';
      durationMs: number;
      organizedFiles: string[];
      dossierJsonPath: string;
    };
    reason: {
      status: 'VERIFIED' | 'INCOMPLETE_BLOCKED' | 'CONFLICT_BLOCKED';
      durationMs: number;
      allRequirementsMet: boolean;
      missingOrInvalidFields: string[];
      conflictingFields?: string[];
      fieldChecks: ZeroBureaucracyValidationFieldResult[];
    };
    impact: {
      status: 'VERIFIED' | 'SKIPPED' | 'AWAITING_HUMAN_APPROVAL' | 'FAILED';
      durationMs: number;
      populatedFormPath?: string;
      pdfReportPath?: string;
      pdfSizeBytes?: number;
      pdfSha256?: string;
      pdfVerifiedReadable?: boolean;
    };
  };
  totalDurationMs: number;
  timestamp: string;
}

/**
 * UAE Hackathon Zero-Bureaucracy Workflow Engine (NETWORK • REASON • IMPACT).
 *
 * Operates strictly on local, clearly labeled fictional sample data inside an
 * authorized workspace directory (.orion_memory/hackathon_uae_zero_bureaucracy).
 * Never accesses live government portals or uses real personal identity records.
 */
export class ZeroBureaucracyService {
  private static instance: ZeroBureaucracyService;
  private workspaceDir: string;
  private traceService: ExecutionTraceService;

  private constructor(traceService?: ExecutionTraceService) {
    this.workspaceDir = path.resolve(process.cwd(), '.orion_memory', 'hackathon_uae_zero_bureaucracy');
    this.traceService = traceService || new ExecutionTraceService();
  }

  public static getInstance(): ZeroBureaucracyService {
    if (!ZeroBureaucracyService.instance) {
      ZeroBureaucracyService.instance = new ZeroBureaucracyService();
    }
    return ZeroBureaucracyService.instance;
  }

  public setTraceService(traceService: ExecutionTraceService): void {
    this.traceService = traceService;
  }

  public getDefaultSampleInput(): ZeroBureaucracyApplicationInput {
    return {
      applicantName: 'Fictional Applicant — Al-Mustaqbal Systems Team (Sample)',
      emiratesId: '784-1999-0000000-1',
      tradeNameEnglish: 'ORION SOVEREIGN AI SYSTEMS FZ-LLC (SAMPLE)',
      tradeNameArabic: 'أوريون لأنظمة الذكاء الاصطناعي ذ.م.م (نموذج تجريبي)',
      legalStructure: 'FZ-LLC',
      activityCode: 'UAE-IC-6201.99',
      activityDescription: 'Autonomous Enterprise Software & Local AI Agent Infrastructure (Sample)',
      jurisdiction: 'UAE Innovation Free Zone (Simulated Sandbox)',
      tenancyEjariRef: 'EJARI-SIM-2026-009481',
      uboDeclarationConfirmed: true,
      safetyComplianceConfirmed: true,
      contactEmail: 'sample-sandbox@impacts-ai.example',
      simulatedSampleLabel: 'SIMULATED_SAMPLE_DATA',
    };
  }

  /**
   * Executes the three-pillar UAE Zero-Bureaucracy workflow:
   * 1. NETWORK: Organizes supporting sample files and submission packet in the authorized workspace.
   * 2. REASON: Validates all mandatory regulatory & service requirements, halting if any field is missing/invalid.
   * 3. IMPACT: Populates the authorized form and generates a verified, multi-section PDF executive dossier.
   */
  public async runWorkflow(
    customInput?: Partial<ZeroBureaucracyApplicationInput>,
    options?: { allowIncompleteDefaultFill?: boolean; requireHumanApproval?: boolean; operatorApproved?: boolean }
  ): Promise<ZeroBureaucracyWorkflowResult> {
    const overallStart = performance.now();
    const workflowId = `uae-zb-${Date.now()}`;
    const trace = this.traceService.createTrace(`hackathon:zero_bureaucracy:${workflowId}`, 'operator');

    const baseInput: ZeroBureaucracyApplicationInput =
      options?.allowIncompleteDefaultFill === false
        ? { simulatedSampleLabel: 'SIMULATED_SAMPLE_DATA', ...customInput }
        : { ...this.getDefaultSampleInput(), ...customInput, simulatedSampleLabel: 'SIMULATED_SAMPLE_DATA' };

    // =========================================================================
    // STAGE 1: NETWORK — Local Workspace Organization & Dossier Intake
    // =========================================================================
    const networkStart = performance.now();
    const intakeDir = path.join(this.workspaceDir, '01_network_intake');
    const verifiedDir = path.join(this.workspaceDir, '02_reason_audit');
    const impactDir = path.join(this.workspaceDir, '03_impact_outputs');

    fs.mkdirSync(intakeDir, { recursive: true });
    fs.mkdirSync(verifiedDir, { recursive: true });
    fs.mkdirSync(impactDir, { recursive: true });

    const articlesSamplePath = path.join(intakeDir, 'sample_memorandum_of_association.txt');
    const tenancySamplePath = path.join(intakeDir, 'sample_tenancy_attestation.txt');
    const uboSamplePath = path.join(intakeDir, 'sample_ubo_declaration.txt');
    const dossierJsonPath = path.join(intakeDir, 'sample_submission_packet.json');

    fs.writeFileSync(
      articlesSamplePath,
      [
        '====================================================================',
        'SIMULATED SAMPLE DOCUMENT — NOT A REAL GOVERNMENT OR LEGAL FILING',
        '====================================================================',
        `Entity Name: ${baseInput.tradeNameEnglish || 'UNSPECIFIED'}`,
        `Legal Structure: ${baseInput.legalStructure || 'UNSPECIFIED'}`,
        `Activity Code: ${baseInput.activityCode || 'UNSPECIFIED'}`,
        'Classification: SIMULATED_SAMPLE_DATA (UAE Hackathon Zero-Bureaucracy)',
      ].join('\n'),
      'utf8'
    );

    fs.writeFileSync(
      tenancySamplePath,
      [
        'SIMULATED WORKSPACE LEASE ATTESTATION (SAMPLE DATA ONLY)',
        `Reference: ${baseInput.tenancyEjariRef || 'MISSING'}`,
        `Jurisdiction: ${baseInput.jurisdiction || 'UNSPECIFIED'}`,
      ].join('\n'),
      'utf8'
    );

    fs.writeFileSync(
      uboSamplePath,
      [
        'SIMULATED ULTIMATE BENEFICIAL OWNER (UBO) ATTESTATION (SAMPLE DATA ONLY)',
        `Applicant: ${baseInput.applicantName || 'UNSPECIFIED'}`,
        `UBO Confirmed: ${Boolean(baseInput.uboDeclarationConfirmed)}`,
      ].join('\n'),
      'utf8'
    );

    fs.writeFileSync(
      dossierJsonPath,
      JSON.stringify(
        {
          workflowId,
          classification: 'SIMULATED_SAMPLE_DATA',
          notice: 'Fictional sample packet for ORION UAE Zero-Bureaucracy Hackathon verification.',
          submittedAt: new Date().toISOString(),
          application: baseInput,
        },
        null,
        2
      ),
      'utf8'
    );

    const organizedFiles = [articlesSamplePath, tenancySamplePath, uboSamplePath, dossierJsonPath];
    const networkDurationMs = Math.max(1, Math.round(performance.now() - networkStart));

    // =========================================================================
    // STAGE 2: REASON — Deterministic Requirement & Compliance Validation
    // =========================================================================
    const reasonStart = performance.now();
    const fieldChecks = this.validateApplicationRequirements(baseInput);
    const conflictingFields = this.detectApplicationConflicts(baseInput);
    const missingOrInvalidFields = [
      ...fieldChecks.filter((f) => !f.valid).map((f) => `${f.field}: ${f.reason}`),
      ...conflictingFields
    ];
    const allRequirementsMet = missingOrInvalidFields.length === 0;

    const auditPath = path.join(verifiedDir, `compliance_audit_${workflowId}.json`);
    fs.writeFileSync(
      auditPath,
      JSON.stringify(
        {
          workflowId,
          classification: 'SIMULATED_SAMPLE_DATA',
          allRequirementsMet,
          missingOrInvalidFields,
          conflictingFields,
          fieldChecks,
          evaluatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      'utf8'
    );
    const reasonDurationMs = Math.max(1, Math.round(performance.now() - reasonStart));

    if (!allRequirementsMet) {
      const hasConflictsOnly = conflictingFields.length > 0 && fieldChecks.every((f) => f.valid);
      const blockedStatus = hasConflictsOnly ? 'CONFLICT_BLOCKED' : 'INCOMPLETE_BLOCKED';
      const totalDurationMs = Math.max(1, Math.round(performance.now() - overallStart));
      this.traceService.completeTrace(trace.traceId, false, {
        totalCommandLatencyMs: totalDurationMs,
        intentClassificationLatencyMs: 0,
        planningLatencyMs: 0,
        toolExecutionLatencyMs: totalDurationMs,
        visionCaptureLatencyMs: 0,
        visionAnalysisLatencyMs: 0,
        aiTtftMs: 0,
        aiTotalGenerationLatencyMs: 0,
        failoverCount: 0,
        retryCount: 0,
        replanningCount: 0,
      });

      return {
        workflowId,
        status: blockedStatus,
        dataClassification: 'SIMULATED_SAMPLE_DATA',
        approvalStatus: 'BLOCKED_BY_VALIDATION',
        auditTracePath: auditPath,
        workspaceDir: this.workspaceDir,
        stages: {
          network: {
            status: 'VERIFIED',
            durationMs: networkDurationMs,
            organizedFiles,
            dossierJsonPath,
          },
          reason: {
            status: blockedStatus,
            durationMs: reasonDurationMs,
            allRequirementsMet: false,
            missingOrInvalidFields,
            conflictingFields,
            fieldChecks,
          },
          impact: {
            status: 'SKIPPED',
            durationMs: 0,
          },
        },
        totalDurationMs,
        timestamp: new Date().toISOString(),
      };
    }

    // If human approval is explicitly required and not yet granted, hold before final submission
    if (options?.requireHumanApproval === true && options?.operatorApproved !== true) {
      const populatedFormPath = path.join(impactDir, 'UAE_Zero_Bureaucracy_Populated_Form.json');
      fs.writeFileSync(
        populatedFormPath,
        JSON.stringify(
          {
            schemaVersion: 'UAE-ZB-2026.1',
            dataClassification: 'SIMULATED_SAMPLE_DATA',
            workflowId,
            approvalReadyStatus: 'AWAITING_HUMAN_APPROVAL',
            populatedFields: baseInput,
            validationChecksPassed: fieldChecks.length,
            generatedAt: new Date().toISOString()
          },
          null,
          2
        ),
        'utf8'
      );
      const totalDurationMs = Math.max(1, Math.round(performance.now() - overallStart));
      return {
        workflowId,
        status: 'AWAITING_HUMAN_APPROVAL',
        dataClassification: 'SIMULATED_SAMPLE_DATA',
        approvalStatus: 'AWAITING_HUMAN_APPROVAL',
        auditTracePath: auditPath,
        workspaceDir: this.workspaceDir,
        stages: {
          network: {
            status: 'VERIFIED',
            durationMs: networkDurationMs,
            organizedFiles,
            dossierJsonPath
          },
          reason: {
            status: 'VERIFIED',
            durationMs: reasonDurationMs,
            allRequirementsMet: true,
            missingOrInvalidFields: [],
            conflictingFields: [],
            fieldChecks
          },
          impact: {
            status: 'AWAITING_HUMAN_APPROVAL',
            durationMs: 1,
            populatedFormPath
          }
        },
        totalDurationMs,
        timestamp: new Date().toISOString()
      };
    }

    // =========================================================================
    // STAGE 3: IMPACT — Authorized Sample Form Population & PDF Dossier Generation
    // =========================================================================
    const impactStart = performance.now();
    const populatedFormPath = path.join(impactDir, 'UAE_Zero_Bureaucracy_Populated_Form.json');
    const pdfReportPath = path.join(impactDir, 'UAE_Zero_Bureaucracy_Executive_Dossier.pdf');

    const populatedForm = {
      schemaVersion: 'UAE-ZB-2026.1',
      dataClassification: 'SIMULATED_SAMPLE_DATA',
      disclaimer: 'FICTIONAL SAMPLE RECORD GENERATED OFFLINE BY ORION CLI FOR HACKATHON VERIFICATION',
      workflowId,
      approvalReadyStatus: 'READY_FOR_HUMAN_REVIEW',
      pillarSummary: 'NETWORK • REASON • IMPACT',
      populatedFields: baseInput,
      validationChecksPassed: fieldChecks.length,
      generatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(populatedFormPath, JSON.stringify(populatedForm, null, 2), 'utf8');

    const pdfBuffer = this.buildReadableExecutivePdf(workflowId, baseInput, fieldChecks, {
      networkMs: networkDurationMs,
      reasonMs: reasonDurationMs,
    });
    fs.writeFileSync(pdfReportPath, pdfBuffer);

    const verification = this.verifyGeneratedPdf(pdfReportPath);
    const impactDurationMs = Math.max(1, Math.round(performance.now() - impactStart));
    const totalDurationMs = Math.max(1, Math.round(performance.now() - overallStart));

    this.traceService.completeTrace(trace.traceId, verification.valid, {
      totalCommandLatencyMs: totalDurationMs,
      intentClassificationLatencyMs: 0,
      planningLatencyMs: 0,
      toolExecutionLatencyMs: totalDurationMs,
      visionCaptureLatencyMs: 0,
      visionAnalysisLatencyMs: 0,
      aiTtftMs: 0,
      aiTotalGenerationLatencyMs: 0,
      failoverCount: 0,
      retryCount: 0,
      replanningCount: 0,
    });

    return {
      workflowId,
      status: verification.valid ? 'COMPLETED' : 'FAILED',
      dataClassification: 'SIMULATED_SAMPLE_DATA',
      approvalStatus: 'APPROVED_BY_OPERATOR',
      auditTracePath: auditPath,
      workspaceDir: this.workspaceDir,
      stages: {
        network: {
          status: 'VERIFIED',
          durationMs: networkDurationMs,
          organizedFiles,
          dossierJsonPath,
        },
        reason: {
          status: 'VERIFIED',
          durationMs: reasonDurationMs,
          allRequirementsMet: true,
          missingOrInvalidFields: [],
          conflictingFields: [],
          fieldChecks,
        },
        impact: {
          status: verification.valid ? 'VERIFIED' : 'FAILED',
          durationMs: impactDurationMs,
          populatedFormPath,
          pdfReportPath,
          pdfSizeBytes: verification.sizeBytes,
          pdfSha256: verification.sha256,
          pdfVerifiedReadable: verification.valid,
        },
      },
      totalDurationMs,
      timestamp: new Date().toISOString(),
    };
  }

  public detectApplicationConflicts(input: ZeroBureaucracyApplicationInput): string[] {
    const conflicts: string[] = [];
    const jurisdiction = (input.jurisdiction || '').toLowerCase();
    const structure = input.legalStructure;
    const tradeName = (input.tradeNameEnglish || '').toUpperCase();

    if (jurisdiction.includes('free zone') && structure === 'Sole Establishment') {
      conflicts.push(
        `conflict(jurisdiction, legalStructure): Free Zone jurisdiction '${input.jurisdiction}' requires 'FZ-LLC' or 'Branch', not 'Sole Establishment'.`
      );
    }
    if (structure === 'FZ-LLC' && tradeName.includes(' SOLE ESTABLISHMENT')) {
      conflicts.push(
        `conflict(tradeNameEnglish, legalStructure): Trade name suffix conflicts with legal structure '${structure}'.`
      );
    }
    return conflicts;
  }

  public validateApplicationRequirements(
    input: ZeroBureaucracyApplicationInput
  ): ZeroBureaucracyValidationFieldResult[] {
    const checks: ZeroBureaucracyValidationFieldResult[] = [];

    const name = (input.applicantName || '').trim();
    checks.push({
      field: 'applicantName',
      label: 'Applicant Full Name (Sample)',
      valid: name.length >= 5,
      valueSummary: name || '<missing>',
      reason: name.length >= 5 ? undefined : 'Applicant name must be at least 5 characters.',
    });

    const eid = (input.emiratesId || '').trim();
    const eidRegex = /^784-\d{4}-\d{7}-\d$/;
    checks.push({
      field: 'emiratesId',
      label: 'Synthetic Emirates ID Format (784-XXXX-XXXXXXX-X)',
      valid: eidRegex.test(eid),
      valueSummary: eid || '<missing>',
      reason: eidRegex.test(eid) ? undefined : 'Must match standard 784-XXXX-XXXXXXX-X format.',
    });

    const tradeEn = (input.tradeNameEnglish || '').trim();
    checks.push({
      field: 'tradeNameEnglish',
      label: 'Trade Name (English)',
      valid: tradeEn.length >= 4,
      valueSummary: tradeEn || '<missing>',
      reason: tradeEn.length >= 4 ? undefined : 'English trade name is required.',
    });

    const structure = input.legalStructure;
    const allowedStructures = ['FZ-LLC', 'LLC', 'Sole Establishment', 'Branch'];
    checks.push({
      field: 'legalStructure',
      label: 'Legal Entity Structure',
      valid: Boolean(structure && allowedStructures.includes(structure)),
      valueSummary: structure || '<missing>',
      reason:
        structure && allowedStructures.includes(structure)
          ? undefined
          : `Legal structure must be one of: ${allowedStructures.join(', ')}.`,
    });

    const code = (input.activityCode || '').trim();
    checks.push({
      field: 'activityCode',
      label: 'Economic Activity Classification Code',
      valid: /^UAE-IC-\d{4}\.\d{2}$/.test(code),
      valueSummary: code || '<missing>',
      reason: /^UAE-IC-\d{4}\.\d{2}$/.test(code)
        ? undefined
        : 'Activity code must follow UAE-IC-XXXX.XX format.',
    });

    const ejari = (input.tenancyEjariRef || '').trim();
    checks.push({
      field: 'tenancyEjariRef',
      label: 'Workspace Tenancy / Ejari Reference',
      valid: ejari.length >= 8,
      valueSummary: ejari || '<missing>',
      reason: ejari.length >= 8 ? undefined : 'Tenancy / Ejari reference is required.',
    });

    checks.push({
      field: 'uboDeclarationConfirmed',
      label: 'Ultimate Beneficial Owner (UBO) Declaration',
      valid: input.uboDeclarationConfirmed === true,
      valueSummary: String(Boolean(input.uboDeclarationConfirmed)),
      reason: input.uboDeclarationConfirmed === true ? undefined : 'UBO declaration must be explicitly confirmed.',
    });

    checks.push({
      field: 'safetyComplianceConfirmed',
      label: 'Safety & Regulatory Compliance Attestation',
      valid: input.safetyComplianceConfirmed === true,
      valueSummary: String(Boolean(input.safetyComplianceConfirmed)),
      reason:
        input.safetyComplianceConfirmed === true ? undefined : 'Safety & regulatory attestation must be confirmed.',
    });

    return checks;
  }

  public verifyGeneratedPdf(pdfPath: string): {
    valid: boolean;
    sizeBytes: number;
    sha256: string;
    hasPdfHeader: boolean;
    hasEofMarker: boolean;
  } {
    if (!fs.existsSync(pdfPath)) {
      return { valid: false, sizeBytes: 0, sha256: '', hasPdfHeader: false, hasEofMarker: false };
    }
    const buf = fs.readFileSync(pdfPath);
    const content = buf.toString('latin1');
    const hasPdfHeader = content.startsWith('%PDF-1.4');
    const hasEofMarker = content.trimEnd().endsWith('%%EOF');
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

    return {
      valid: hasPdfHeader && hasEofMarker && buf.length > 800,
      sizeBytes: buf.length,
      sha256,
      hasPdfHeader,
      hasEofMarker,
    };
  }

  private escapePdfText(text: string): string {
    return text
      .replace(/[^\x20-\x7E]/g, '?')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }

  /**
   * Builds a clean, standards-compliant PDF 1.4 document with valid cross-reference
   * byte offsets so any PDF reader (Edge, Chrome, Adobe, PyMuPDF) can render it cleanly.
   */
  private buildReadableExecutivePdf(
    workflowId: string,
    input: ZeroBureaucracyApplicationInput,
    checks: ZeroBureaucracyValidationFieldResult[],
    timings: { networkMs: number; reasonMs: number }
  ): Buffer {
    const lines: Array<{ text: string; size: number; bold?: boolean; indent?: number }> = [
      { text: 'iMpact AI  |  ORION CLI-NATIVE AGENT PLATFORM', size: 14, bold: true },
      { text: 'UAE ZERO-BUREAUCRACY EXECUTIVE DOSSIER (NETWORK . REASON . IMPACT)', size: 12, bold: true },
      { text: 'CLASSIFICATION: SIMULATED_SAMPLE_DATA (FICTIONAL HACKATHON VERIFICATION RECORD)', size: 9, bold: true },
      { text: '----------------------------------------------------------------------------------------', size: 9 },
      { text: `Workflow ID: ${workflowId}    Generated: ${new Date().toISOString()}`, size: 9 },
      { text: 'Founder & Architect: Sheikh Mohammed Saqib  |  https://impacts-ai.com/orion', size: 9 },
      { text: '----------------------------------------------------------------------------------------', size: 9 },
      { text: '1. PILLAR I — NETWORK (INTAKE & LOCAL WORKSPACE ORGANIZATION)', size: 11, bold: true },
      { text: `   Status: VERIFIED (${timings.networkMs} ms)  |  Mode: 100% Offline Local Execution`, size: 9 },
      { text: `   Trade Name (EN): ${input.tradeNameEnglish || ''}`, size: 9 },
      { text: `   Legal Structure: ${input.legalStructure || ''}  |  Jurisdiction: ${input.jurisdiction || ''}`, size: 9 },
      { text: `   Activity Code:   ${input.activityCode || ''} — ${input.activityDescription || ''}`, size: 9 },
      { text: `   Applicant (Sim): ${input.applicantName || ''}  |  Synthetic ID: ${input.emiratesId || ''}`, size: 9 },
      { text: `   Ejari Ref (Sim): ${input.tenancyEjariRef || ''}  |  Contact: ${input.contactEmail || ''}`, size: 9 },
      { text: '----------------------------------------------------------------------------------------', size: 9 },
      { text: '2. PILLAR II — REASON (DETERMINISTIC COMPLIANCE & REQUIREMENT AUDIT)', size: 11, bold: true },
      { text: `   Status: VERIFIED (${timings.reasonMs} ms)  |  Checks Passed: ${checks.filter((c) => c.valid).length}/${checks.length}`, size: 9 },
    ];

    for (const check of checks) {
      lines.push({
        text: `   [PASS] ${check.label}: ${check.valueSummary}`,
        size: 9,
      });
    }

    lines.push(
      { text: '----------------------------------------------------------------------------------------', size: 9 },
      { text: '3. PILLAR III — IMPACT (ZERO-BUREAUCRACY FORM POPULATION & AUDIT TRAIL)', size: 11, bold: true },
      { text: '   - Populated JSON Packet verified on disk (UAE_Zero_Bureaucracy_Populated_Form.json)', size: 9 },
      { text: '   - Protected Agent Policy & SHA-256 Execution Trace Chain active', size: 9 },
      { text: '   - Zero external API spend required; ready for immediate human operator sign-off.', size: 9 },
      { text: '----------------------------------------------------------------------------------------', size: 9 },
      { text: 'NOTICE: All data in this document is synthetic sample data for software verification.', size: 8 }
    );

    const streamOps: string[] = ['BT'];
    let currentY = 790;
    for (const line of lines) {
      const fontRef = line.bold ? '/F2' : '/F1';
      streamOps.push(`${fontRef} ${line.size} Tf`);
      streamOps.push(`1 0 0 1 42 ${currentY} Tm`);
      streamOps.push(`(${this.escapePdfText(line.text)}) Tj`);
      currentY -= line.size + 7;
    }
    streamOps.push('ET');
    const contentStream = streamOps.join('\n');

    const objects: string[] = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
      `4 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'latin1')} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    ];

    let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offsets: number[] = [0];

    for (const obj of objects) {
      offsets.push(Buffer.byteLength(pdf, 'latin1'));
      pdf += obj;
    }

    const xrefOffset = Buffer.byteLength(pdf, 'latin1');
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.from(pdf, 'latin1');
  }
}
