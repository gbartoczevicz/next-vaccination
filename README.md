# Next Vaccination

Projeto da Jornada de Aprendizagem da Faculdade - Logística de Vacinação

***

## Casos de Uso

### Usuários

O usuário que deseja se vacinar usará o app mobile

Requisitos

- [ ] Criar e atualizar conta
- [ ] Atualizar foto
- [ ] Acessar e baixar ticket único de vacinação
- [ ] Consultar ponto de vacinação por mapa no aplicativo
- [ ] Criar agendamento num horário disponível
- [ ] Consultar notificações de cancelamento do agendamento
- [ ] Consultar histórico de agendamentos de vacinação
- [ ] Recuperar senha por e-mail

Regras de negócio

- Não deve ser possível cadastrar um e-mail, CPF e Whatsapp já usados
- Nome, nascimento, e-mail, CPF, Whatsapp, gênero e descrição da rotina são obrigatórios
- Não deve ser possível criar um agendamento num horário não disponível
- Não deve ser possível criar um agendamento sem a sua rotina ser categorizada
- Não deve ser possível cancelar o agendamento X horas antes da data
- Não deve ser possível realizar mais de um agendamento por data

### Hospital

Esta sessão será dividida entre o responsável do ponto de vacinação e os profissionais da saúde.

#### Responsável

O responsável vai usar a aplicação web

Requisitos

- [ ] Cadastrar e manter ponto de vacinação
- [ ] Cadastrar e manter o próprio cadastro de responsável
- [ ] Enviar e-mail para os profissionais da saúde se cadastrarem no sistema pelo celular
- [ ] Manter estoque de vacina
- [ ] Cancelar agendamentos
- [ ] Alterar disponibilidade de agendamentos diários
- [ ] Alterar a quantidade de pessoas a serem vacinadas por período
- [ ] Consultar histórico de pessoas vacinadas pelo hospital
- [ ] Recuperar senha por e-mail

Regras de negócio

- Não deve ser possível cadastrar um e-mail, __document__ e Whatsapp já usados
- Nome, e-mail, __document__, Whatsapp do responsável são obrigatórios
- Nome, endereço, telefone de contato e __document__ do ponto de vacinação são obrigatórios 
- Não deve ser possível cadastrar um telefone e __document__ de pontos de vacinação já usados
- Não deve ser possível cancelar o agendamento X horas antes da data
- Ao cancelar um agendamento, o paciente deverá ser notificado
- Ao alterar o estoque de vacinas todos os membros da organização deverão ser notificados

#### Profissional da Saúde

O profissional vai usar a aplicação mobile

Requisitos

- [ ] Manter cadastro no sistema
- [ ] Ler o QR Code do ticket do paciente após vacinar o mesmo
- [ ] Recuperar senha por e-mail

Regras de negócio

- Não deve ser possível cadastrar um e-mail, __document__ e Whatsapp já usados
- Nome, e-mail, __document__, Whatsapp do responsável são obrigatórios
- Não deve ser possível vacinar um mesmo paciênte mais de uma vez por data
- Ao vacinar o paciênte o estoque terá que ser subtraído por 1

***

##### Observações

- __document__: Vamos utilizar algum código único da área da saúde para o funcionário (contando com o responsável) e o hospital
