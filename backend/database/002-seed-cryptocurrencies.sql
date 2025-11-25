INSERT INTO cryptocurrencies (id, name, symbol, price)
VALUES
  ('93f0b284-3a61-4c9a-aff2-d47f38dcefb6', 'Bitcoin', 'BTC', 50000.00),
  ('bbb8e982-49ef-44de-aa39-bca67e683c2f','Ethereum', 'ETH', 3000.00),
  ('9ec25abf-6ed8-48e3-ae75-8d952cbbc2ed', 'BNB', 'BNB', 400.00),
  ('f259b6f1-fd07-45ce-93b0-3458b08dbb88', 'XRP', 'XRP', 0.55)
ON CONFLICT (symbol) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price;
