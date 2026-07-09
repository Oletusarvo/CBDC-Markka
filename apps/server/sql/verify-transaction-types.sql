CREATE OR REPLACE FUNCTION verify_transaction_types()
RETURNS TRIGGER AS $$ 
  DECLARE 
  input_trx_type INT;
  output_trx_type INT;
  
  BEGIN
    SELECT "transaction_type_id" FROM transaction_data WHERE "id" = NEW.input_transaction_id INTO input_trx_type;
    SELECT "transaction_type_id" FROM transaction_data WHERE "id" = NEW.output_transaction_id INTO output_trx_type;
    IF 
      input_trx_type <> (SELECT "id" FROM transaction_type WHERE "label" = 'input' LIMIT 1)
      OR 
      output_trx_type <> (SELECT "id" FROM transaction_type WHERE "label" = 'output' LIMIT 1)
      THEN 
        RAISE 'Mismatch in referenced transaction types! The output transaction must be of type output, and the input transaction of type input!';
      END IF;
    RETURN NEW;
  END
$$ LANGUAGE PLPGSQL;
    
CREATE OR REPLACE TRIGGER verify_transaction_types
BEFORE INSERT OR UPDATE ON transaction_metadata 
FOR EACH ROW 
EXECUTE FUNCTION verify_transaction_types();