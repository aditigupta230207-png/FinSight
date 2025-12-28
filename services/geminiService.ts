import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AnalysisResult, TaxAnalysisResult } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash for speed on dashboard tasks
const MODEL_FAST = "gemini-3-flash-preview"; 
// Using Pro for deep reasoning on tax laws
const MODEL_REASONING = "gemini-3-pro-preview";

// Helper to robustly parse JSON from AI response
const cleanAndParseJSON = (text: string | undefined): any => {
  if (!text) throw new Error("No response from AI");
  
  let cleaned = text;

  // 1. Remove Markdown code blocks
  cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');

  // 2. Find outermost braces to ignore conversational intro/outro
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }

  // 3. Trim
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Attempt to handle common JSON issues
    try {
      // Fix unescaped newlines within strings (basic attempt)
      // This regex looks for newlines that are likely inside value strings
      const fixed = cleaned.replace(/([^\\])\n/g, '$1\\n');
      return JSON.parse(fixed);
    } catch (e2) {
      console.error("JSON parsing failed. Raw text length:", text.length);
      throw e;
    }
  }
};

export const generateSpendingInsight = async (transactions: Transaction[]): Promise<string> => {
  try {
    const prompt = `
      Analyze the following financial transactions (in INR) and provide a 3-sentence summary of spending habits, highlighting the largest expense category.
      Transactions: ${JSON.stringify(transactions.slice(0, 20))}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        systemInstruction: "You are a concise financial analyst specialized in the Indian market.",
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "AI service currently unavailable.";
  }
};

export const generateTaxReport = async (transactions: Transaction[]): Promise<{
  deductibleExpenses: string[];
  estimatedTaxLiability: string;
  advice: string;
}> => {
  try {
    // Only looking at expenses for tax deduction analysis
    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    
    const response = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: `Analyze these expenses for potential tax deductions for a generic India-based freelancer/professional. 
      Expenses: ${JSON.stringify(expenses)}.
      Return a JSON object with:
      - deductibleExpenses: array of strings describing potential write-offs or Section 80 deductions based on the list.
      - estimatedTaxLiability: a generic disclaimer string about liability in India.
      - advice: a paragraph of actionable tax-saving advice based on this spending profile (mention relevant Indian Tax Sections like 80C, 80D, etc. if applicable).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            deductibleExpenses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedTaxLiability: { type: Type.STRING },
            advice: { type: Type.STRING }
          }
        }
      }
    });

    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.error("Gemini Tax Report Error:", error);
    return {
      deductibleExpenses: [],
      estimatedTaxLiability: "Error calculating",
      advice: "Could not generate tax report. Please verify API configuration."
    };
  }
};

export const analyzeBankStatement = async (data: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    // Determine content part based on mimeType (Text vs Binary)
    // Excel/CSV data will be passed as text/csv or text/plain
    const contentPart = mimeType.startsWith('text/') 
      ? { text: `Analyze this bank statement data:\n${data}` }
      : { inlineData: { mimeType, data } }; // data is base64 string here

    const prompt = `Analyze this bank statement. 
    1. Extract the total income (sum of all deposits/credits).
    2. Extract the total expenditure (sum of all withdrawals/debits).
    3. Provide a very brief summary (max 20 words) of the account activity.
    4. Classify all expenses into detailed categories.
       - IMPORTANT: Group expenses by category (e.g., Food, Travel). Do NOT list every single transaction separately. Sum them up per category.
       - For each category, provide a list of major vendors.
    5. Identify repetitive/recurring transactions (same merchant appearing multiple times). List them sorted by total amount paid (highest to lowest).`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: {
        parts: [
          contentPart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalIncome: { type: Type.NUMBER },
            totalExpense: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  vendors: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            amount: { type: Type.NUMBER }
                        }
                    }
                  }
                }
              }
            },
            recurring: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        merchant: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        count: { type: Type.NUMBER }
                    }
                }
            }
          }
        }
      }
    });

    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.error("Bank Statement Analysis Error:", error);
    return { 
      totalIncome: 0, 
      totalExpense: 0, 
      summary: "Failed to analyze document. Please ensure it is a valid bank statement.",
      breakdown: [] 
    };
  }
};

export const analyzeTaxDocument = async (data: string, mimeType: string): Promise<TaxAnalysisResult> => {
  try {
    const contentPart = mimeType.startsWith('text/') 
      ? { text: `Analyze this financial document:\n${data}` }
      : { inlineData: { mimeType, data } };

    const prompt = `Analyze this financial document specifically for detailed Indian Income Tax Return (ITR) preparation.
    
    Classify financial flows with high precision.
    IMPORTANT: Consolidate data to avoid exceeding output limits. Do NOT list every individual transaction.

    1. **Income Analysis**:
       - **Total Gross Income**: Sum of all inflows.
       - **Classification**: Breakdown into 'Salary', 'Business/Professional', 'Interest', 'Dividend', and 'Other'.
       - **Recurring Sources**: Identify MAIN clients/sources that pay regularly.
       - **Flagged Credits**: Identify ONLY high-value or unusual credits (> ₹50,000) that might attract tax scrutiny.

    2. **Expense Analysis**:
       - **Deductible vs Non-Deductible**: 
         - **Deductible**: Business-related expenses allowed under Section 37.
         - **Non-Deductible**: Personal expenses.
         - **Deductible Breakdown**: Aggregate expenses by CATEGORY (e.g., 'Travel', 'Software', 'Rent'). Do not list individual line items.
       - **Scrutiny Risks**: Flag specific expenses that are business-claimed but risky (e.g., "Cash withdrawals", "Personal luxury items").

    3. **ITR Context**:
       - Suggest ITR Form (ITR-1, ITR-3, ITR-4).
       - Detect relevant sections (44ADA, 80C, etc.).

    4. **AI Insight**:
       - Provide a strategic insight title, description, and potential tax savings amount.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_REASONING,
      contents: {
        parts: [contentPart, { text: prompt }]
      },
      config: {
        // Increase token limit to prevent JSON truncation on large files
        maxOutputTokens: 20000,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            income: {
              type: Type.OBJECT,
              properties: {
                totalGross: { type: Type.NUMBER },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    salary: { type: Type.NUMBER },
                    business: { type: Type.NUMBER },
                    interest: { type: Type.NUMBER },
                    dividend: { type: Type.NUMBER },
                    other: { type: Type.NUMBER }
                  }
                },
                recurringSources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      frequency: { type: Type.STRING }
                    }
                  }
                },
                flaggedCredits: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      description: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      reason: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            expenses: {
              type: Type.OBJECT,
              properties: {
                totalDeductible: { type: Type.NUMBER },
                totalNonDeductible: { type: Type.NUMBER },
                deductibleBreakdown: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: {
                        category: { type: Type.STRING },
                        amount: { type: Type.NUMBER }
                     }
                  }
                },
                scrutinyRisks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      description: { type: Type.STRING },
                      amount: { type: Type.NUMBER },
                      riskReason: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            itrContext: {
              type: Type.OBJECT,
              properties: {
                suggestedForm: { type: Type.STRING },
                detectedSections: { type: Type.ARRAY, items: { type: Type.STRING } },
                notes: { type: Type.STRING }
              }
            },
            aiInsight: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                potentialSavings: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    return cleanAndParseJSON(response.text);
  } catch (error) {
    console.error("Tax Document Analysis Error:", error);
    return {
      income: { 
        totalGross: 0,
        breakdown: { salary: 0, business: 0, interest: 0, dividend: 0, other: 0 },
        recurringSources: [],
        flaggedCredits: []
      },
      expenses: { 
        totalDeductible: 0, 
        totalNonDeductible: 0, 
        deductibleBreakdown: [],
        scrutinyRisks: [] 
      },
      itrContext: { suggestedForm: "N/A", detectedSections: [], notes: "Analysis failed." },
      aiInsight: { title: "Error", description: "Could not analyze document. Please try a clearer or smaller file.", potentialSavings: "₹0" }
    };
  }
};

export const chatWithFinanceAssistant = async (
  message: string, 
  contextData: string
) => {
  try {
    const chat = ai.chats.create({
      model: MODEL_FAST,
      config: {
        systemInstruction: `You are FinSight, a helpful, professional, and witty personal finance assistant specialized in the Indian market. 
        You have access to the user's current view context data: ${contextData}.
        Answer in Indian Rupees (₹) when discussing money.
        Keep answers short and relevant to their data if asked.`,
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the financial brain right now.";
  }
};