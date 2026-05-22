'use client'

import { useState } from 'react'
const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Claire", email: "claire@example.com" },
];

export default function UsersPage() {
    const [shouldThrow, setShouldThrow] = useState(false)

    if (shouldThrow) {
        throw new Error('Erreur de test depuis le dashboard')
    }
    return (
        <div>
            <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Utilisateurs</h2>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr style={{ backgroundColor: '#333', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Nom</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ backgroundColor: user.id % 2 === 0 ? '#f5f5f5' : 'white', borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '12px', color: '#333' }}>{user.id}</td>
                            <td style={{ padding: '12px', color: '#333' }}>{user.name}</td>
                            <td style={{ padding: '12px', color: '#333' }}>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br></br>

            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShouldThrow(true)}>Provoquer une erreur</button>
        </div>
    );
}
