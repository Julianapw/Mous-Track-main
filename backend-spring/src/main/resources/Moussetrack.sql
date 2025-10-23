USE moussetrack;
INSERT INTO usuarios (
  cliente_id,
  email,
  senha_hash,
  nome,
  telefone,
  tipo_usuario,
  ativo
) VALUES (
  1,
  'teste@empresa.com',
  '$2a$10$YpTllmxeuFbH0G8zv7vZtuf4pB8iG5YchEpKU8VxLknac8W7vJHjK',
  'Usuário Teste',
  '19999999999',
  'admin',
  1
);


INSERT INTO clientes (nome, cnpj)
VALUES ('Empresa Teste LTDA', '12.345.678/0001-90');

ALTER TABLE usuarios
MODIFY cliente_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY;

SELECT * FROM USUARIOS WHERE EMAIL = 'teste@empresa.com';
