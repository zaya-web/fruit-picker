import { prisma } from '@/app/lib/prisma';

export default async function TestDB() {
    const workers = await prisma.worker.findMany();

    return(
        <div>
            <h1>Workers</h1>

            {workers.map((worker)=>(
                <p key={worker.id}>
                    {worker.name}
                </p>
            ))}
        </div>
    );
}