import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { VaccineBatch } from '@entities/vaccination-point';
import { ConclusionsPersistence } from '@external/mappers/conclusions';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindAll, FindUnique, IConclusionsRepository, Save } from '@usecases/output-ports/repositories/conclusions';

export class PrismaConclusionsRepo implements IConclusionsRepository {
  private conclusionsMapper: IMapper<Conclusion, ConclusionsPersistence>;

  constructor(conclusionsMapper: IMapper<Conclusion, ConclusionsPersistence>) {
    this.conclusionsMapper = conclusionsMapper;
  }

  async save(conclusion: Conclusion): Promise<Save> {
    try {
      const rawToSave = <ConclusionsPersistence>this.conclusionsMapper.toPersistence(conclusion);

      const rawResult = await client.conclusion.create({
        data: {
          id: rawToSave.id,
          appointmentId: rawToSave.appointmentId,
          vaccinatedAt: rawToSave.vaccinatedAt,
          vaccinatedById: rawToSave.vaccinatedById,
          vaccineBatchId: rawToSave.vaccineBatchId
        },
        include: {
          appointment: {
            include: {
              patient: {
                include: {
                  user: true
                }
              },
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccinatedBy: {
            include: {
              user: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccineBatch: {
            include: {
              vaccine: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          }
        }
      });

      const savedDomain = <Conclusion>this.conclusionsMapper.toDomain(rawResult);

      return right(savedDomain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findAllByVaccineBatch(vaccineBatch: VaccineBatch): Promise<FindAll> {
    try {
      const rawResult = await client.conclusion.findMany({
        where: {
          vaccineBatchId: vaccineBatch.id.value
        },
        include: {
          appointment: {
            include: {
              patient: {
                include: {
                  user: true
                }
              },
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccinatedBy: {
            include: {
              user: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccineBatch: {
            include: {
              vaccine: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          }
        }
      });

      const conclusions = rawResult.map((result) => <Conclusion>this.conclusionsMapper.toDomain(result));

      return right(conclusions);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByAppointment(appointment: Appointment): Promise<FindUnique> {
    try {
      const rawResult = await client.conclusion.findFirst({
        where: {
          appointmentId: appointment.id.value
        },
        include: {
          appointment: {
            include: {
              patient: {
                include: {
                  user: true
                }
              },
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccinatedBy: {
            include: {
              user: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          },
          vaccineBatch: {
            include: {
              vaccine: true,
              vaccinationPoint: {
                include: {
                  location: true
                }
              }
            }
          }
        }
      });

      if (!rawResult) {
        return right(null);
      }

      const conclusions = <Conclusion>this.conclusionsMapper.toDomain(rawResult);

      return right(conclusions);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
