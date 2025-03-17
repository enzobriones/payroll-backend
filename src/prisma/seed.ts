import {
  PrismaClient,
  ContractType,
  HealthType,
  PayrollStatus,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando proceso de seed...');

  // Limpiar la base de datos (en orden para evitar problemas con las relaciones)
  console.log('🧹 Limpiando la base de datos...');
  await prisma.payroll.deleteMany();
  await prisma.address.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.healthPlan.deleteMany();
  await prisma.aFP.deleteMany();
  await prisma.department.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Base de datos limpiada correctamente');

  // Crear usuario administrador
  const hashedPassword = await hash('Admin123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@empresa.cl',
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuario administrador creado: ${adminUser.email}`);

  // Crear empresa
  const empresa = await prisma.company.create({
    data: {
      name: 'Servicios Tecnológicos SpA',
      rut: '76.123.456-7',
      userId: adminUser.id,
      address: {
        create: {
          street: 'Av. Apoquindo',
          number: '4800',
          commune: 'Las Condes',
          province: 'Santiago',
          city: 'Santiago',
          region: 'Metropolitana',
          country: 'Chile',
        },
      },
    },
  });

  console.log(`✅ Empresa creada: ${empresa.name}`);

  // Crear AFP
  const afps = await Promise.all([
    prisma.aFP.create({
      data: { name: 'AFP Provida', discount: 10.58 },
    }),
    prisma.aFP.create({
      data: { name: 'AFP Habitat', discount: 10.27 },
    }),
    prisma.aFP.create({
      data: { name: 'AFP Capital', discount: 10.44 },
    }),
    prisma.aFP.create({
      data: { name: 'AFP Modelo', discount: 9.77 },
    }),
    prisma.aFP.create({
      data: { name: 'AFP Cuprum', discount: 10.48 },
    }),
  ]);

  console.log(`✅ ${afps.length} AFPs creadas`);

  // Crear planes de salud
  const healthPlans = await Promise.all([
    // FONASA
    prisma.healthPlan.create({
      data: {
        type: HealthType.FONASA,
        name: 'FONASA Tramo A',
        discount: 0,
      },
    }),
    prisma.healthPlan.create({
      data: {
        type: HealthType.FONASA,
        name: 'FONASA Tramo B',
        discount: 7,
      },
    }),
    prisma.healthPlan.create({
      data: {
        type: HealthType.FONASA,
        name: 'FONASA Tramo C',
        discount: 7,
      },
    }),
    prisma.healthPlan.create({
      data: {
        type: HealthType.FONASA,
        name: 'FONASA Tramo D',
        discount: 7,
      },
    }),
    // ISAPRE
    prisma.healthPlan.create({
      data: {
        type: HealthType.ISAPRE,
        name: 'Colmena Plan Básico',
        discount: 8.5,
      },
    }),
    prisma.healthPlan.create({
      data: {
        type: HealthType.ISAPRE,
        name: 'Cruz Blanca Esencial',
        discount: 9.2,
      },
    }),
    prisma.healthPlan.create({
      data: {
        type: HealthType.ISAPRE,
        name: 'Banmédica Premium',
        discount: 10.8,
      },
    }),
  ]);

  console.log(`✅ ${healthPlans.length} planes de salud creados`);

  // Crear departamentos
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Desarrollo',
        description: 'Departamento de desarrollo de software',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Recursos Humanos',
        description: 'Gestión del personal y contrataciones',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finanzas',
        description: 'Contabilidad y finanzas corporativas',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        description: 'Estrategias de marketing y ventas',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Operaciones',
        description: 'Gestión operativa y logística',
      },
    }),
  ]);

  console.log(`✅ ${departments.length} departamentos creados`);

  // Crear empleados con sus direcciones y liquidaciones
  const empleados = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      birthDate: new Date('1985-03-15'),
      hireDate: new Date('2020-01-10'),
      baseSalary: 1500000,
      jobTitle: 'Desarrollador Senior',
      contractType: ContractType.FULL_TIME,
      healthType: HealthType.ISAPRE,
      weeklyHours: 45,
      afpId: afps[0].id,
      healthPlanId: healthPlans[6].id,
      departmentId: departments[0].id,
      companyId: empresa.id,
      address: {
        street: 'Los Alerces',
        number: '234',
        apartment: '503',
        commune: 'Providencia',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
    {
      firstName: 'María',
      lastName: 'González',
      birthDate: new Date('1990-07-22'),
      hireDate: new Date('2019-05-15'),
      baseSalary: 1300000,
      jobTitle: 'Analista de RRHH',
      contractType: ContractType.FULL_TIME,
      healthType: HealthType.FONASA,
      weeklyHours: 45,
      afpId: afps[1].id,
      healthPlanId: healthPlans[3].id,
      departmentId: departments[1].id,
      companyId: empresa.id,
      address: {
        street: 'Hernando de Aguirre',
        number: '128',
        commune: 'Ñuñoa',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
    {
      firstName: 'Pedro',
      lastName: 'Soto',
      birthDate: new Date('1988-11-05'),
      hireDate: new Date('2021-03-01'),
      baseSalary: 1800000,
      jobTitle: 'Gerente de Finanzas',
      contractType: ContractType.FULL_TIME,
      healthType: HealthType.ISAPRE,
      weeklyHours: 45,
      afpId: afps[2].id,
      healthPlanId: healthPlans[5].id,
      departmentId: departments[2].id,
      companyId: empresa.id,
      address: {
        street: 'Los Leones',
        number: '1256',
        apartment: '803',
        commune: 'Las Condes',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
    {
      firstName: 'Carla',
      lastName: 'Morales',
      birthDate: new Date('1992-04-18'),
      hireDate: new Date('2022-01-15'),
      baseSalary: 1100000,
      jobTitle: 'Asistente de Marketing',
      contractType: ContractType.PART_TIME,
      healthType: HealthType.FONASA,
      weeklyHours: 30,
      afpId: afps[3].id,
      healthPlanId: healthPlans[2].id,
      departmentId: departments[3].id,
      companyId: empresa.id,
      address: {
        street: 'Irarrázaval',
        number: '3450',
        apartment: '205',
        commune: 'Ñuñoa',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
    {
      firstName: 'Roberto',
      lastName: 'Fuentes',
      birthDate: new Date('1980-09-30'),
      hireDate: new Date('2018-08-01'),
      baseSalary: 2200000,
      jobTitle: 'Director de Operaciones',
      contractType: ContractType.FULL_TIME,
      healthType: HealthType.ISAPRE,
      weeklyHours: 45,
      afpId: afps[4].id,
      healthPlanId: healthPlans[6].id,
      departmentId: departments[4].id,
      companyId: empresa.id,
      address: {
        street: 'José Miguel Carrera',
        number: '785',
        commune: 'Santiago Centro',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
    {
      firstName: 'Ana',
      lastName: 'Valdés',
      birthDate: new Date('1993-02-12'),
      hireDate: new Date('2022-04-01'),
      baseSalary: 1400000,
      jobTitle: 'Desarrollador Full Stack',
      contractType: ContractType.CONTRACTOR,
      healthType: HealthType.ISAPRE,
      weeklyHours: 40,
      afpId: afps[0].id,
      healthPlanId: healthPlans[4].id,
      departmentId: departments[0].id,
      companyId: empresa.id,
      address: {
        street: 'Américo Vespucio',
        number: '1240',
        apartment: '405',
        commune: 'La Florida',
        province: 'Santiago',
        city: 'Santiago',
        region: 'Metropolitana',
      },
    },
  ];

  // Crear empleados con sus direcciones
  for (const empleadoData of empleados) {
    const { address, ...empleado } = empleadoData;

    const createdEmpleado = await prisma.employee.create({
      data: {
        ...empleado,
        addresses: {
          create: address,
        },
      },
    });

    // Generar liquidaciones para cada empleado (últimos 6 meses)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (let i = 0; i < 6; i++) {
      let month = currentMonth - i;
      let year = currentYear;

      if (month <= 0) {
        month += 12;
        year -= 1;
      }

      // Calcular descuentos
      const afp = await prisma.aFP.findUnique({
        where: { id: empleado.afpId },
      });
      const healthPlan = await prisma.healthPlan.findUnique({
        where: { id: empleado.healthPlanId },
      });

      const afpDiscount = Math.floor(
        (empleado.baseSalary * (afp?.discount || 0)) / 100
      );
      const healthDiscount = Math.floor(
        (empleado.baseSalary * (healthPlan?.discount || 0)) / 100
      );
      const unemploymentDiscount = Math.floor((empleado.baseSalary * 3) / 100); // 3% para seguro de cesantía
      const totalDiscount = afpDiscount + healthDiscount + unemploymentDiscount;

      await prisma.payroll.create({
        data: {
          month,
          year,
          grossSalary: empleado.baseSalary,
          healthDiscount,
          afpDiscount,
          unemploymentDiscount,
          totalDiscount,
          netSalary: empleado.baseSalary - totalDiscount,
          status: i < 3 ? PayrollStatus.PAID : PayrollStatus.PENDING,
          paidAt: i < 3 ? new Date(year, month - 1, 5) : null,
          employeeId: createdEmpleado.id,
        },
      });
    }
  }

  console.log(
    `✅ ${empleados.length} empleados creados con sus direcciones y liquidaciones`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Proceso de seed completado exitosamente');
  });
