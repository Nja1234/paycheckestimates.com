/*
 * PaycheckEstimates 2026 tax data — single source of truth.
 *
 * Federal figures verified against IRS 2026 guidance.
 * The state rules below are for the 10 currently published state pages.
 * They estimate annual state income tax from the calculator inputs. They do not
 * model every possible credit, deduction, residency allocation, or local tax.
 */
const TAX_2026 = Object.freeze({
  year: 2026,

  standardDeduction: Object.freeze({
    single: 16100,
    married: 32200,
    hoh: 24150
  }),

  federalBrackets: Object.freeze({
    single: Object.freeze([
      [12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24],
      [256225, 0.32], [640600, 0.35], [Infinity, 0.37]
    ]),
    married: Object.freeze([
      [24800, 0.10], [100800, 0.12], [211400, 0.22], [403550, 0.24],
      [512450, 0.32], [768700, 0.35], [Infinity, 0.37]
    ]),
    hoh: Object.freeze([
      [17700, 0.10], [67450, 0.12], [105700, 0.22], [201750, 0.24],
      [256200, 0.32], [640600, 0.35], [Infinity, 0.37]
    ])
  }),

  payroll: Object.freeze({
    socialSecurityRate: 0.062,
    socialSecurityWageBase: 184500,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareWithholdingThreshold: 200000
  }),

  retirement: Object.freeze({
    k401EmployeeDeferralLimit: 24500
  }),

  /*
   * State income-tax estimation rules for the 10 currently published states.
   * Primary-source checks performed 2026-09-04.
   *
   * CA: 2026 Form 540-ES directs estimated-tax filers to use the 2025 CA tax
   * table/rate schedules; standard deductions are $5,706/$11,412 and the
   * personal exemption credit is $153/$306.
   * FL/TX/WA: no individual wage income tax in 2026.
   * GA: 4.99% flat rate; 2026 standard deduction $15,000 single/HOH and $30,000 MFJ.
   * IL: 4.95%; $2,925 exemption allowance per person.
   * NY: 2026 IT-2105-I rates/deductions; NYC/Yonkers not modeled.
   * OH: 2026 0% through $26,050 then $332 + 2.75%; personal exemption
   *     varies by income tier; municipal/school-district taxes not modeled.
   * PA: 3.07% flat state tax; employee 401(k) contributions remain taxable for PA PIT; local taxes not modeled.
   * VA: 2/3/5/5.75% schedule with 2026 standard deduction $8,750/$17,500.
   */
  stateRules: Object.freeze({
    FL: Object.freeze({ type: 'none' }),
    TX: Object.freeze({ type: 'none' }),
    WA: Object.freeze({ type: 'none' }),

    GA: Object.freeze({
      type: 'flat',
      rate: 0.0499,
      standardDeduction: Object.freeze({ single: 15000, married: 30000, hoh: 15000 })
    }),

    IL: Object.freeze({
      type: 'flatExemption',
      rate: 0.0495,
      exemptionPerPerson: 2925,
      exemptionPhaseout: Object.freeze({ single: 250000, married: 500000, hoh: 250000 })
    }),

    PA: Object.freeze({
      type: 'flatNoPreTax',
      rate: 0.0307,
      standardDeduction: Object.freeze({ single: 0, married: 0, hoh: 0 })
    }),

    OH: Object.freeze({
      type: 'ohio2026',
      zeroBracket: 26050,
      baseTaxOverZeroBracket: 332,
      rateOverZeroBracket: 0.0275,
      exemption: Object.freeze({
        tier1Income: 40000,
        tier2Income: 80000,
        tier1Amount: 2350,
        tier2Amount: 2100,
        tier3Amount: 1850,
        capIncome: 500000
      })
    }),

    VA: Object.freeze({
      type: 'bracketsWithDeduction',
      standardDeduction: Object.freeze({ single: 8750, married: 17500, hoh: 8750 }),
      brackets: Object.freeze([
        [3000, 0.02],
        [5000, 0.03],
        [17000, 0.05],
        [Infinity, 0.0575]
      ]),
      baseTaxes: Object.freeze([0, 60, 660, 720])
    }),

    NY: Object.freeze({
      type: 'bracketsWithDeduction',
      standardDeduction: Object.freeze({ single: 8000, married: 16050, hoh: 11200 }),
      bracketsByStatus: Object.freeze({
        single: Object.freeze([
          [8500, 0.039], [11700, 0.044], [13900, 0.0515], [80650, 0.054],
          [215400, 0.059], [1077550, 0.0685], [5000000, 0.0965],
          [25000000, 0.103], [Infinity, 0.109]
        ]),
        married: Object.freeze([
          [17150, 0.039], [23600, 0.044], [27900, 0.0515], [161550, 0.054],
          [323200, 0.059], [2155350, 0.0685], [5000000, 0.0965],
          [25000000, 0.103], [Infinity, 0.109]
        ]),
        hoh: Object.freeze([
          [12800, 0.039], [17650, 0.044], [20900, 0.0515], [107650, 0.054],
          [269300, 0.059], [1616450, 0.0685], [5000000, 0.0965],
          [25000000, 0.103], [Infinity, 0.109]
        ])
      })
    }),

    CA: Object.freeze({
      type: 'california2026',
      standardDeduction: Object.freeze({ single: 5706, married: 11412, hoh: 11412 }),
      personalCredit: Object.freeze({ single: 153, married: 306, hoh: 153 }),
      bracketsByStatus: Object.freeze({
        single: Object.freeze([
          [11079, 0.01, 0],
          [26264, 0.02, 110.79],
          [41452, 0.04, 414.49],
          [57542, 0.06, 1022.01],
          [72724, 0.08, 1987.41],
          [371479, 0.093, 3201.97],
          [445771, 0.103, 30986.19],
          [742953, 0.113, 38638.27],
          [Infinity, 0.123, 72219.84]
        ]),
        married: Object.freeze([
          [22158, 0.01, 0],
          [52528, 0.02, 221.58],
          [82904, 0.04, 828.98],
          [115084, 0.06, 2044.02],
          [145448, 0.08, 3974.82],
          [742958, 0.093, 6403.94],
          [891542, 0.103, 61972.37],
          [1485906, 0.113, 77276.52],
          [Infinity, 0.123, 144439.65]
        ]),
        hoh: Object.freeze([
          [22173, 0.01, 0],
          [52530, 0.02, 221.73],
          [67716, 0.04, 828.87],
          [83805, 0.06, 1436.31],
          [98990, 0.08, 2401.65],
          [505208, 0.093, 3616.45],
          [606251, 0.103, 41394.72],
          [1010417, 0.113, 51802.15],
          [Infinity, 0.123, 97472.91]
        ])
      })
    })
  })
});

function _taxFromBrackets(income, brackets) {
  if (income <= 0) return 0;
  let tax = 0;
  let previous = 0;
  for (const row of brackets) {
    const limit = row[0];
    const rate = row[1];
    const baseTax = row.length >= 3 ? row[2] : null;
    if (income <= previous) break;
    if (baseTax !== null) {
      if (income <= limit) {
        tax = baseTax + (income - previous) * rate;
        return Math.max(0, tax);
      }
      previous = limit;
      continue;
    }
    tax += (Math.min(income, limit) - previous) * rate;
    previous = limit;
    if (limit === Infinity) break;
  }
  return Math.max(0, tax);
}

function calculateStateIncomeTax(state, grossWages, preTaxDeductions, filingStatus) {
  const gross = Math.max(0, Number(grossWages));
  const preTax = Math.max(0, Number(preTaxDeductions));
  const income = Math.max(0, gross - preTax);
  const status = filingStatus === 'married' ? 'married' : filingStatus === 'hoh' ? 'hoh' : 'single';
  const rule = TAX_2026.stateRules[state];
  if (!rule || rule.type === 'none' || income <= 0) return 0;

  if (rule.type === 'flat') {
    const deduction = rule.standardDeduction?.[status] ?? 0;
    return Math.max(0, income - deduction) * rule.rate;
  }

  if (rule.type === 'flatNoPreTax') {
    // Pennsylvania generally taxes employee 401(k) contributions; use gross wages
    // rather than subtracting the calculator's generic federal pre-tax deductions.
    return gross * rule.rate;
  }

  if (rule.type === 'flatExemption') {
    const people = status === 'married' ? 2 : 1;
    const phaseoutAt = rule.exemptionPhaseout?.[status] ?? Infinity;
    const exemption = income <= phaseoutAt ? rule.exemptionPerPerson * people : 0;
    return Math.max(0, income - exemption) * rule.rate;
  }

  if (rule.type === 'ohio2026') {
    let perPerson;
    if (income <= rule.exemption.tier1Income) perPerson = rule.exemption.tier1Amount;
    else if (income <= rule.exemption.tier2Income) perPerson = rule.exemption.tier2Amount;
    else perPerson = rule.exemption.tier3Amount;
    if (income >= rule.exemption.capIncome) perPerson = 0;
    const people = status === 'married' ? 2 : 1;
    const taxable = Math.max(0, income - perPerson * people);
    if (taxable <= rule.zeroBracket) return 0;
    return rule.baseTaxOverZeroBracket + (taxable - rule.zeroBracket) * rule.rateOverZeroBracket;
  }

  if (rule.type === 'bracketsWithDeduction') {
    const deduction = rule.standardDeduction[status];
    const taxable = Math.max(0, income - deduction);
    const brackets = rule.bracketsByStatus ? rule.bracketsByStatus[status] : rule.brackets;
    return _taxFromBrackets(taxable, brackets);
  }

  if (rule.type === 'california2026') {
    const deduction = rule.standardDeduction[status];
    const taxable = Math.max(0, income - deduction);
    let tax = _taxFromBrackets(taxable, rule.bracketsByStatus[status]);
    // California's Mental Health Services Tax adds 1% to taxable income over $1,000,000.
    if (taxable > 1000000) tax += (taxable - 1000000) * 0.01;
    tax = Math.max(0, tax - rule.personalCredit[status]);
    return tax;
  }

  return 0;
}
