CREATE OR REPLACE FUNCTION verify_transactions_equal()
RETURNS TRIGGER AS $$
  DECLARE
    output_amount BIGINT;
    input_amount BIGINT;
  BEGIN 
    SELECT amount_in_cents FROM transaction_data WHERE id = NEW.input_transaction_id INTO input_amount;
    SELECT amount_in_cents FROM transaction_data WHERE id = NEW.output_transaction_id INTO output_amount;
    IF output_amount <> input_amount THEN 
      RAISE 'Input and output amounts must be equal!';
    END IF;
    RETURN NEW;
  END
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE TRIGGER verify_transactions_equal
BEFORE INSERT OR UPDATE ON transaction_metadata 
FOR EACH ROW
EXECUTE FUNCTION verify_transactions_equal();