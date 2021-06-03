# Next Vaccination

Projeto da Jornada de Aprendizagem da Faculdade - Logística de Vacinação

***

## Casos de Uso

### Geral

Todos os usuários poderão realizar essas ações

Requisitos

- [x] Criar conta
- [x] Atualizar conta
- [ ] Recuperar senha por e-mail
- [ ] Consultar notificações

Regras de negócio

- [x] Não deve ser possível cadastrar um e-mail, CPF e Whatsapp já usados
- [x] Nome, nascimento, e-mail, CPF, Whatsapp são obrigatórios

### Pacientes

O usuário que deseja se vacinar usará o app mobile

Requisitos

- [ ] Atualizar foto
- [ ] Acessar e baixar ticket único de vacinação
- [x] Consultar pontos de vacinação
- [x] Criar agendamento num horário disponível
- [x] Cancelar agendamento
- [ ] Consultar histórico de agendamentos de vacinação

Regras de negócio

- [x] Não deve ser possível criar um agendamento num horário não disponível
- [x] Não deve ser possível criar um agendamento com estoque não disponível
- [x] Não deve ser possível realizar um agendamento sem possuir um ticket
- [ ] Não deve ser possível cancelar o agendamento X horas antes da data
- [ ] Não deve ser possível realizar mais de um agendamento por data
- [ ] Notificar ponto de vacinação ao cancelar o agendamento

### Hospital

Esta sessão será dividida entre o responsável do ponto de vacinação e os profissionais da saúde.

#### Responsável

O responsável vai usar a aplicação web

Requisitos

- [x] Cadastrar ponto de vacinação
- [x] Atualizar ponto de vacinação
- [x] Cancelar agendamentos
- [x] Criar disponibilidade de agendamentos
- [x] Atualizar disponibilidade de agendamentos
- [x] Manter estoque de vacina
- [ ] Enviar e-mail para os profissionais da saúde se cadastrarem no sistema pelo celular
- [ ] Consultar histórico de agendamentos no ponto de vacinação

Regras de negócio

- [x] Não deve ser possível cadastrar um __document__ já usado
- [x] __document__ do responsável é obrigatório
- [x] Nome, endereço, telefone de contato e __document__ do ponto de vacinação são obrigatórios 
- [x] Não deve ser possível cadastrar um telefone e __document__ de pontos de vacinação já usados
- [ ] Ao cancelar um agendamento, o paciente deverá ser notificado
- [ ] Notificar todos os profissionais da saúde quando os estoques estiverem baixos

#### Profissional da Saúde

O profissional vai usar a aplicação mobile

Requisitos

- [ ] Ler o QR Code do ticket do paciente após vacinar o mesmo

Regras de negócio

- [ ] Ao vacinar o paciênte o estoque terá que ser subtraído por 1
- [ ] Notificar o paciente e ao ponto ao dar baixa no agendamento

***

##### Observações

- __document__: Vamos utilizar algum código único da área da saúde para o funcionário (contando com o responsável) e o hospital
