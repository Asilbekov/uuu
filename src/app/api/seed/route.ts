import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const SEED_QUESTIONS: Record<string, { question: string; options: { A: string; B: string; C: string; D: string; E?: string }; correct: string }[]> = {
  "Acid-Base & Equilibrium": [
    { question: "Calculate the pH of an aqueous solution that contains 3.50×10⁻³ M [OH⁻]", options: { A: "5.0", B: "11.5", C: "3.9", D: "7.6" }, correct: "B" },
    { question: "Select the correct statement about equilibrium", options: { A: "The equilibrium constant changes with temperature.", B: "The equilibrium constant changes with pressure.", C: "The equilibrium constant changes with the concentration of reactants and products.", D: "Adding a catalyst to a system at equilibrium will shift towards the products.", E: "All the statements of this list are correct." }, correct: "A" },
    { question: "What happens when a weak acid is diluted in water?", options: { A: "The pH will increase.", B: "The pH will decrease.", C: "The degree of dissociation increases.", D: "The degree of dissociation decreases.", E: "Both A and C are correct." }, correct: "C" },
    { question: "What happens when an aqueous basic solution is diluted with water?", options: { A: "The pH will decrease.", B: "The pH will increase.", C: "[OH⁻] will increase.", D: "[H₃O⁺] will decrease." }, correct: "A" },
    { question: "A catalyst is a substance that added to modify", options: { A: "The rate of a chemical reaction", B: "The equilibrium constant", C: "The enthalpy of reaction", D: "The entropy of reaction", E: "Both A and B" }, correct: "A" },
    { question: "For a heterogeneous equilibrium involving a solid and a gas, the equilibrium constant expression", options: { A: "Does not include the concentration of the solid", B: "Includes the concentration of the solid", C: "Is always equal to 1", D: "Depends on the amount of solid" }, correct: "A" },
    { question: "For a chemical system at (dynamic) equilibrium", options: { A: "The rates of the forward and reverse reactions are equal", B: "The concentrations of reactants and products are equal", C: "No more reactions occur", D: "The forward reaction stops", E: "Both A and C" }, correct: "A" },
    { question: "What happens if carbon is added to the following equilibrium system at constant temperature: C(s) + H₂O(g) ⇌ CO(g) + H₂(g)?", options: { A: "No effect on equilibrium", B: "Equilibrium shifts right", C: "Equilibrium shifts left", D: "Kc changes" }, correct: "A" },
    { question: "At a constant temperature, the equilibrium constant Kp of the following reaction changes when", options: { A: "Pressure changes", B: "Concentration changes", C: "Temperature changes", D: "Catalyst is added" }, correct: "C" },
    { question: "What happens if the pressure is doubled in the reactor where the following reaction occurs? 2NO(g) + O₂(g) → 2NO₂(g)", options: { A: "Equilibrium shifts to the right side", B: "Equilibrium shifts to the left side", C: "No change in equilibrium", D: "Kc decreases" }, correct: "A" },
    { question: "For the reaction H₂(g) + Br₂(g) → 2HBr(g) with K = 62.5, find the equilibrium concentration of HBr", options: { A: "0.32 M", B: "7.91 M", C: "1.58 M", D: "3.95 M", E: "Cannot be determined" }, correct: "B" },
    { question: "Which of the following factors doesn't affect the reaction rate?", options: { A: "All the factors in this list affect the reaction rate", B: "Temperature", C: "Presence of catalyst", D: "Particle size of solid reactants", E: "Effective collision between reactant molecules" }, correct: "A" },
    { question: "What happens when an aqueous basic solution is diluted with water?", options: { A: "The pH will decrease.", B: "The pH will increase.", C: "[OH⁻] will increase.", D: "[H₃O⁺] will decrease." }, correct: "A" },
    { question: "Select the correct definition of dissociation degree of a solute in a solution.", options: { A: "The fraction of solute molecules that dissociate into ions", B: "The concentration of ions in solution", C: "The total number of solute particles", D: "The pH of the solution" }, correct: "A" },
    { question: "What does osmotic pressure of an ideal solution depend on?", options: { A: "The molar concentration of solute particles", B: "The nature of the solute", C: "The molecular weight of solute", D: "The volume of solvent only", E: "Both A and B" }, correct: "A" },
  ],
  "Electrochemistry": [
    { question: "Considering the standard reduction potentials, what can you infer about the following reaction in standard conditions?", options: { A: "The reaction is spontaneous", B: "The reaction is non-spontaneous", C: "The cell potential is zero", D: "Cannot be determined" }, correct: "A" },
    { question: "What happens during the discharging of a Daniell Cell?", options: { A: "The mass of the copper electrode decreases", B: "The mass of every electrode decreases", C: "The mass of the zinc electrode increases", D: "The mass of the copper electrode increases" }, correct: "D" },
    { question: "A quantity of electricity, corresponding to 1 faraday of charge, is passed through a solution of CuSO₄. What mass of copper is deposited?", options: { A: "63.5 g", B: "31.75 g", C: "127 g", D: "6.35 g" }, correct: "B" },
    { question: "How many grams of silver will be produced if a current of 1.50 A passes through a solution of AgNO₃ for 30.0 minutes?", options: { A: "3.02 g", B: "1.51 g", C: "6.04 g", D: "0.75 g" }, correct: "A" },
    { question: "How long must a current of 5.00 A be applied to a solution of Ag⁺ to produce 10.0 g of silver metal?", options: { A: "29.8 min", B: "59.7 min", C: "14.9 min", D: "1.49 min", E: "89.5 min" }, correct: "A" },
    { question: "Using a current of 4.75 A, how many minutes does it take to plate onto a sculpture 1.50 g of Cu from a CuSO₄ solution?", options: { A: "16.9 min", B: "33.8 min", C: "8.45 min", D: "67.6 min", E: "50.7 min" }, correct: "A" },
    { question: "A Cr³⁺(aq) solution is electrolyzed using a current of 13.5 A. What mass of Cr(s) is produced in 2.00 hours?", options: { A: "9.74 g", B: "19.5 g", C: "4.87 g", D: "29.2 g", E: "14.6 g" }, correct: "A" },
    { question: "Using a current of 4.75 A, how many minutes does it take to plate onto a sculpture 1.50 g of Cu from a Cu²⁺ solution?", options: { A: "16.9 min", B: "33.8 min", C: "8.45 min", D: "67.6 min" }, correct: "A" },
    { question: "In a solution containing zinc ions is placed a piece of copper. According to the electrochemical series", options: { A: "No reaction occurs since copper is less reactive than zinc", B: "Copper displaces zinc", C: "Zinc plates onto copper", D: "The solution turns blue" }, correct: "A" },
    { question: "A Cr³⁺(aq) solution is electrolyzed using a current of 13.5 A. What mass of Cr(s) is produced in 2.00 hours?", options: { A: "9.74 g", B: "19.5 g", C: "4.87 g", D: "29.2 g", E: "14.6 g" }, correct: "A" },
  ],
  "Gases & Gas Laws": [
    { question: "A sample of an unknown gas effuses in 11.1 min. An equal volume of hydrogen in the same apparatus at the same temperature and pressure effuses in 2.42 min. What is the molar mass of the unknown gas?", options: { A: "42.0 g/mol", B: "21.0 g/mol", C: "84.0 g/mol", D: "168 g/mol" }, correct: "A" },
    { question: "If I have an unknown quantity of gas at a pressure of 1.2 atm, a volume of 31 liters, and a temperature of 87°C, how many moles of gas do I have?", options: { A: "1.24 mol", B: "2.48 mol", C: "0.62 mol", D: "4.96 mol", E: "3.72 mol" }, correct: "A" },
    { question: "Calcium has a face-centered cubic unit cell and a density of 1.55 g/cm³. What is the atomic radius of calcium?", options: { A: "197 pm", B: "139 pm", C: "278 pm", D: "98.5 pm", E: "55.6 pm" }, correct: "A" },
    { question: "Barium has a body-centered cubic unit cell and a density of 3.62 g/cm³. What is the atomic radius of barium?", options: { A: "222 pm", B: "157 pm", C: "314 pm", D: "111 pm" }, correct: "A" },
    { question: "For structures consisting of identical atoms, how many atoms are contained in a face-centered cubic unit cell?", options: { A: "1", B: "2", C: "4", D: "6", E: "8" }, correct: "C" },
    { question: "For structures consisting of identical atoms, how many atoms are contained in a body-centered cubic unit cell?", options: { A: "1", B: "2", C: "4", D: "6", E: "8" }, correct: "B" },
    { question: "For structures consisting of identical atoms, how many atoms are contained in a simple cubic unit cell?", options: { A: "1", B: "2", C: "4", D: "6", E: "8" }, correct: "A" },
    { question: "At a given pressure and temperature, it takes 4.55 min for a 1.5 L sample of He to effuse through a pinhole. How long will it take for a 1.5 L sample of ethylene (C₂H₄) to effuse under the same conditions?", options: { A: "3.69 min", B: "7.38 min", C: "2.80 min", D: "5.61 min" }, correct: "A" },
    { question: "A vessel contains 1 mol of oxygen and 1 mol of nitrogen. What happens to the partial pressure of oxygen if 1 mol of helium is added at constant volume and temperature?", options: { A: "It stays the same", B: "It doubles", C: "It halves", D: "It triples" }, correct: "A" },
    { question: "A quantity of an ideal gas is compressed isothermally to 3 times its initial pressure. What happens to its volume?", options: { A: "Volume becomes 1/3 of original", B: "Volume triples", C: "Volume stays the same", D: "Volume becomes 9 times original" }, correct: "A" },
    { question: "Under conditions of fixed volume and amount of gas, which of the following properties is proportional to temperature?", options: { A: "Pressure", B: "Volume", C: "Density", D: "Molar mass", E: "All of the above" }, correct: "A" },
    { question: "At given temperature and pressure, which of the following gases has the lowest thermal conductivity?", options: { A: "Xe", B: "He", C: "H₂", D: "Ne" }, correct: "A" },
    { question: "If I have 7.7 moles of gas at a pressure of 0.09 atm and at a temperature of 56°C, what is the volume of the container that the gas is in?", options: { A: "2340 L", B: "1170 L", C: "4680 L", D: "585 L", E: "3510 L" }, correct: "A" },
    { question: "If I contain 3 moles of gas in a container with a volume of 60 liters and at a temperature of 400 K, what is the pressure inside the container?", options: { A: "1.64 atm", B: "3.28 atm", C: "0.82 atm", D: "6.56 atm", E: "4.92 atm" }, correct: "A" },
    { question: "What is the total pressure (in atm) exerted by a mixture of 2.00 g of H₂ and 8.00 g of N₂ in a 5.00 L flask at 25°C?", options: { A: "5.09 atm", B: "2.55 atm", C: "10.2 atm", D: "7.63 atm", E: "1.27 atm" }, correct: "A" },
    { question: "Calculate the ratio of rates of ²³⁸UF₆ and ²³⁹PuF₆ upon pumping through a series of chambers", options: { A: "1.004:1", B: "1.001:1", C: "0.996:1", D: "1.008:1" }, correct: "A" },
    { question: "Uranium is converted to gaseous UF₆ and pumped through a series of chambers with porous barriers. Which compound effuses faster?", options: { A: "²³⁵UF₆ effuses faster", B: "²³⁸UF₆ effuses faster", C: "Both effuse at the same rate", D: "Cannot be determined" }, correct: "A" },
    { question: "What volume (in L) of CO₂ will be obtained upon burning of 2.5 moles of 3-methylpentane?", options: { A: "1.00 × 10¹", B: "1.50 × 10¹", C: "7.50", D: "2.50", E: "1.25 × 10¹" }, correct: "A" },
    { question: "A 6.0-L flask contains a mixture of methane, argon, and helium at 45°C and 1.50 atm. If the mole fraction of methane is 0.25, what is the partial pressure of methane?", options: { A: "0.375 atm", B: "0.75 atm", C: "1.125 atm", D: "0.50 atm", E: "1.50 atm" }, correct: "A" },
    { question: "A 6.0-L flask contains a mixture of methane, argon, and helium at 45°C and 1.50 atm. What is the total number of moles of gas in the flask?", options: { A: "0.342 mol", B: "0.171 mol", C: "0.684 mol", D: "0.513 mol", E: "1.026 mol" }, correct: "A" },
    { question: "What is the name of a movement of solvent through the semi-permeable membrane into a solution of higher solute concentration?", options: { A: "Osmosis", B: "Diffusion", C: "Effusion", D: "Active transport" }, correct: "A" },
    { question: "What is the name of a movement of solvent through the semi-permeable membrane into a solution of higher solute concentration?", options: { A: "Osmosis", B: "Diffusion", C: "Effusion", D: "Reverse osmosis" }, correct: "A" },
    { question: "How is called the transition of a substance directly from the solid to the gas phase?", options: { A: "Sublimation", B: "Evaporation", C: "Condensation", D: "Deposition" }, correct: "A" },
  ],
  "Solutions & Colligative Properties": [
    { question: "Which of the following statements about solution dilution is true?", options: { A: "The number of moles of solute remains constant", B: "The concentration increases", C: "The volume decreases", D: "The mass of solute changes" }, correct: "A" },
    { question: "Which of the following statements about the characteristic of solution is correct?", options: { A: "A solution is a homogeneous mixture", B: "A solution can be separated by filtration", C: "Solutions are always colorless", D: "Solutions only contain one solute" }, correct: "A" },
    { question: "Select the aqueous solution with the lowest freezing temperature. Suppose that all the solute concentrations are 0.10 m.", options: { A: "NaCl", B: "Na₂SO₄", C: "AlCl₃", D: "C₆H₁₂O₆", E: "KBr" }, correct: "C" },
    { question: "What is the effect of the dilution of an unsaturated aqueous solution of NaCl on its concentration?", options: { A: "Concentration decreases", B: "Concentration increases", C: "Concentration stays the same", D: "Cannot be determined", E: "It becomes saturated" }, correct: "A" },
    { question: "Select the correct statement about ebullioscopic constant.", options: { A: "It is a colligative property that depends on the solvent", B: "It depends on the solute concentration", C: "It is the same for all solvents", D: "It measures the freezing point depression", E: "It depends on the nature of the solute" }, correct: "A" },
    { question: "Select the aqueous solution with the lowest osmotic pressure", options: { A: "0.1 M sucrose", B: "0.1 M NaCl", C: "0.1 M CaCl₂", D: "0.1 M AlCl₃" }, correct: "A" },
    { question: "Select the liquid with the highest boiling temperature. Suppose that the density of all liquids is the same.", options: { A: "Pure water", B: "0.1 m sugar solution", C: "0.2 m sugar solution", D: "0.1 m NaCl solution", E: "0.2 m NaCl solution" }, correct: "E" },
    { question: "Pure benzene freezes at 5.5°C and boils at 80.1°C. What is the boiling point of a solution of 5.00 g of naphthalene (C₁₀H₈) in 200 g of benzene?", options: { A: "81.0°C", B: "82.0°C", C: "80.5°C", D: "83.0°C", E: "79.1°C" }, correct: "A" },
    { question: "What is the boiling point of a solution of 1.0 g of glycerin, C₃H₅(OH)₃, in 47.8 g of water?", options: { A: "100.12°C", B: "100.24°C", C: "100.06°C", D: "100.48°C", E: "100.36°C" }, correct: "A" },
    { question: "Select the aqueous solution with the lowest freezing temperature. Suppose that all solute concentrations are 0.10 m.", options: { A: "NaCl", B: "Na₂SO₄", C: "AlCl₃", D: "C₆H₁₂O₆", E: "KBr" }, correct: "C" },
    { question: "What is the boiling point of a solution of 11.0 g of lactose (C₁₂H₂₂O₁₁) in 145.0 g of water?", options: { A: "100.12°C", B: "100.24°C", C: "100.06°C", D: "100.48°C", E: "100.36°C" }, correct: "A" },
    { question: "A large portion of metabolic energy arises from the biological combustion of glucose. What type of reaction is this?", options: { A: "Exothermic", B: "Endothermic", C: "Isothermic", D: "Adiabatic" }, correct: "A" },
  ],
  "Thermochemistry & Thermodynamics": [
    { question: "Which of the following is not a form of energy?", options: { A: "Pressure", B: "Heat", C: "Light", D: "Electricity" }, correct: "A" },
    { question: "Which of the following laws indicates the irreversibility of natural processes?", options: { A: "Second law of thermodynamics", B: "First law of thermodynamics", C: "Boyle's law", D: "Charles's law" }, correct: "A" },
    { question: "1219 J of heat raise the temperature of 250 g of a metal by 64.0°C. What is the specific heat capacity of the metal?", options: { A: "0.0762 J/g·°C", B: "0.0763 J/g·°C", C: "0.0764 J/g·°C", D: "0.0765 J/g·°C" }, correct: "A" },
    { question: "Find heat released (in kJ) when 2.50 mol sample of water in closed container undergoes the transition from liquid to solid.", options: { A: "-83.5 kJ", B: "-167 kJ", C: "-41.8 kJ", D: "-21.0 kJ", E: "83.5 kJ" }, correct: "A" },
    { question: "In the reduction of 10.04 g of the iron (III) oxide with hydrogen (with the formation of water vapor), the amount of heat absorbed is", options: { A: "10.4 kJ", B: "20.8 kJ", C: "5.2 kJ", D: "41.6 kJ", E: "2.6 kJ" }, correct: "A" },
    { question: "Find heat released (in J) when 2.50 mol sample of gaseous water in closed container undergoes condensation.", options: { A: "1.01 × 10⁵ J", B: "2.02 × 10⁵ J", C: "5.05 × 10⁴ J", D: "4.04 × 10⁵ J", E: "3.03 × 10⁵ J" }, correct: "A" },
    { question: "The specific heat capacity of lead is 0.13 J/g·°C. How many joules of heat would be required to raise the temperature of 50.0 g of lead by 10.0°C?", options: { A: "65 J", B: "130 J", C: "32.5 J", D: "260 J", E: "16.3 J" }, correct: "A" },
    { question: "Find the heat (in kJ) transferred when 2.75 L of ethylene glycol (d = 1.11 g/mL) cools from 25°C to 0°C. (Specific heat = 2.42 J/g·°C)", options: { A: "-185 kJ", B: "-92.5 kJ", C: "-370 kJ", D: "-46.3 kJ", E: "-740 kJ" }, correct: "A" },
    { question: "Find the heat (in kJ) transferred when 5.50 L of ethylene glycol (d = 1.11 g/mL) cools from 25°C to 0°C. (Specific heat = 2.42 J/g·°C)", options: { A: "-370 kJ", B: "-185 kJ", C: "-740 kJ", D: "-92.5 kJ", E: "-1480 kJ" }, correct: "A" },
    { question: "Calculate the change in energy (ΔE) of a system (in kcal) when expanding gases do 75 J of work on surroundings and 150 J of heat is absorbed.", options: { A: "0.018 kcal", B: "0.036 kcal", C: "0.072 kcal", D: "0.090 kcal", E: "0.108 kcal" }, correct: "A" },
    { question: "Calculate the change in energy (ΔE) of a system (in kcal) when expanding gases do 1.58 × 10³ J of work on surroundings and 52.5 kJ of heat is absorbed.", options: { A: "12.2 kcal", B: "6.1 kcal", C: "24.4 kcal", D: "3.05 kcal", E: "48.8 kcal" }, correct: "A" },
    { question: "Select the maximum amount of water obtainable by reaction of 1 mole of gaseous hydrogen and 1 mole of gaseous oxygen.", options: { A: "18 g", B: "36 g", C: "9 g", D: "2 g", E: "1 g" }, correct: "A" },
  ],
  "Atomic Structure & Bonding": [
    { question: "Rydberg equation was found to predict the wavelength of any line at the spectrum of atomic hydrogen. Calculate the wavelength (in nm) of the line corresponding to n₁ = 2 and n₂ = 4.", options: { A: "486", B: "434", C: "656", D: "45", E: "None of these choices is correct" }, correct: "A" },
    { question: "Which of the following compounds contains covalent bonds?", options: { A: "Na₂O", B: "KBr", C: "CH₄", D: "MgO" }, correct: "C" },
  ],
  "Stoichiometry & Moles": [
    { question: "Select the correct definition of a mole of iron.", options: { A: "Avogadro's number of iron atoms.", B: "56 × 6.022 g of iron.", C: "The amount of iron that reacts completely with a mole of O₂.", D: "6.022 × 10²³ molecules of iron." }, correct: "A" },
    { question: "What is the molar concentration of chloride ions in 2 liters of an aqueous solution containing 1 mole of CaCl₂?", options: { A: "1 M", B: "0.5 M", C: "2 M", D: "0.25 M" }, correct: "A" },
    { question: "Select the correct definition of a mole of argon.", options: { A: "Avogadro's number of argon atoms.", B: "40 × 6.022 g of argon.", C: "The amount of argon that reacts with one mole of O₂.", D: "6.022 × 10²³ molecules of argon.", E: "Both A and D" }, correct: "A" },
    { question: "The atomic weight of an atom is...", options: { A: "The weighted average mass of the naturally occurring isotopes", B: "The mass of the most abundant isotope", C: "Always a whole number", D: "Equal to the mass number" }, correct: "A" },
  ],
};

export async function POST(request: NextRequest) {
  try {
    // Create demo user
    const hashedPassword = createHash('sha256').update('demo123').digest('hex');
    let user = await db.user.findUnique({ where: { email: 'demo@chemtest.com' } });
    if (!user) {
      user = await db.user.create({
        data: {
          email: 'demo@chemtest.com',
          name: 'Demo User',
          password: hashedPassword,
        },
      });
    }

    // Create tests from seed data
    const createdTests = [];
    for (const [topic, questions] of Object.entries(SEED_QUESTIONS)) {
      const existingTest = await db.test.findFirst({
        where: { title: `Chemistry: ${topic}`, creatorId: user.id },
      });

      if (!existingTest) {
        const test = await db.test.create({
          data: {
            title: `Chemistry: ${topic}`,
            description: `A comprehensive test covering ${topic.toLowerCase()} concepts`,
            topic,
            creatorId: user.id,
            isPublic: true,
            randomizeQuestions: true,
            randomizeOptions: true,
            questions: {
              create: questions.map((q, index) => ({
                text: q.question,
                optionA: q.options.A,
                optionB: q.options.B,
                optionC: q.options.C,
                optionD: q.options.D,
                optionE: q.options.E || null,
                correctAnswer: q.correct,
                orderNum: index,
              })),
            },
          },
          include: { questions: true },
        });
        createdTests.push(test.id);
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      testsCreated: createdTests.length,
      totalQuestions: Object.values(SEED_QUESTIONS).reduce((sum, qs) => sum + qs.length, 0),
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
