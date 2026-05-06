-- 1. Insert Categories first (to get their IDs)
-- We use variables to store IDs for the next step

DO $$
DECLARE
    expenses_id uuid := gen_random_uuid();
    budget_id uuid := gen_random_uuid();
    savings_id uuid := gen_random_uuid();
    account_id uuid := gen_random_uuid();
BEGIN
    -- Insert Categories
    INSERT INTO public.faq_categories (id, name, slug) VALUES 
    (expenses_id, 'Expenses', 'expenses'),
    (budget_id, 'Budget', 'budget'),
    (savings_id, 'Savings', 'savings'),
    (account_id, 'Account', 'account');

    -- Insert FAQ Items
    INSERT INTO public.faq_items (id, category_id, question, answer, is_published) VALUES
    -- Expenses
    (gen_random_uuid(), expenses_id, 'How do I track expenses?', 'Tap the + button on the home screen, enter your amount, select a category and tap Save.', true),
    (gen_random_uuid(), expenses_id, 'How do I edit a transaction?', 'Tap any transaction from the Expenses screen, then tap Edit Transaction.', true),
    (gen_random_uuid(), expenses_id, 'Can I export my transactions?', 'Yes! On the Expenses screen, tap the export icon next to the search bar.', true),
    
    -- Budget
    (gen_random_uuid(), budget_id, 'How do budgets work?', 'You set a spending limit for each category. The app tracks your expenses and shows how close you are to the limit.', true),
    (gen_random_uuid(), budget_id, 'How do I create a budget?', 'Go to the Budget tab and tap the + button. Choose a category and set your limit.', true),
    (gen_random_uuid(), budget_id, 'Can I reset my monthly budget?', 'Budgets reset automatically at the start of each month.', true),
    
    -- Savings
    (gen_random_uuid(), savings_id, 'How do I set a savings goal?', 'Go to the Savings tab and tap +. Enter a goal name and target amount.', true),
    (gen_random_uuid(), savings_id, 'How do I add funds to my goal?', 'Open any savings goal and tap Add Funds. Enter the amount you want to save.', true),
    (gen_random_uuid(), savings_id, 'Can I have multiple savings goals?', 'Yes! You can create as many goals as you need.', true),
    
    -- Account
    (gen_random_uuid(), account_id, 'How do I change my password?', 'Go to Profile > Security & Privacy > Change Password.', true),
    (gen_random_uuid(), account_id, 'How do I delete my account?', 'Go to Profile > Security & Privacy > Delete Account. Note: this action is permanent.', true);

END $$;
