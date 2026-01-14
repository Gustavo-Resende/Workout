import crypto from 'crypto';

/**
 * Script para gerar uma chave secreta JWT segura
 * 
 * Uso:
 *   node scripts/generate-jwt-secret.js
 * 
 * Ou via npm:
 *   npm run generate:jwt-secret
 */

function generateJWTSecret() {
    // Gera uma chave aleatória de 64 bytes (512 bits) em base64
    const secret = crypto.randomBytes(64).toString('base64');
    
    console.log('\n🔐 Chave JWT gerada com sucesso!\n');
    console.log('Adicione esta linha ao seu arquivo .env:');
    console.log('─'.repeat(60));
    console.log(`JWT_SECRET=${secret}`);
    console.log('─'.repeat(60));
    console.log('\n⚠️  IMPORTANTE: Mantenha esta chave em segredo e não a compartilhe!\n');
    
    return secret;
}

// Executa o script
generateJWTSecret();

export { generateJWTSecret };
