<?php
// upload-imagem.php
// Script simples para receber e salvar imagens no servidor

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

// Verificar se o arquivo foi enviado
if (!isset($_FILES['imagem']) || $_FILES['imagem']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Nenhum arquivo enviado ou erro no upload']);
    exit;
}

$file = $_FILES['imagem'];
$nomeArquivo = isset($_POST['nomeArquivo']) ? $_POST['nomeArquivo'] : $file['name'];
$caminhoDestino = isset($_POST['caminho']) ? $_POST['caminho'] : 'assets/sabores/';

// Validar tipo de arquivo (apenas imagens)
$tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$tipoArquivo = mime_content_type($file['tmp_name']);

if (!in_array($tipoArquivo, $tiposPermitidos)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Tipo de arquivo não permitido. Apenas imagens são aceitas.']);
    exit;
}

// Validar tamanho (máximo 5MB)
$tamanhoMaximo = 5 * 1024 * 1024; // 5MB
if ($file['size'] > $tamanhoMaximo) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Arquivo muito grande. Máximo: 5MB']);
    exit;
}

// Garantir que o caminho termina com /
if (substr($caminhoDestino, -1) !== '/') {
    $caminhoDestino .= '/';
}

// Criar diretório se não existir
if (!is_dir($caminhoDestino)) {
    if (!mkdir($caminhoDestino, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Não foi possível criar o diretório']);
        exit;
    }
}

// Caminho completo do arquivo
$caminhoCompleto = $caminhoDestino . $nomeArquivo;

// Mover arquivo para o destino
if (move_uploaded_file($file['tmp_name'], $caminhoCompleto)) {
    echo json_encode([
        'success' => true,
        'message' => 'Imagem salva com sucesso!',
        'caminho' => $caminhoCompleto,
        'nomeArquivo' => $nomeArquivo
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro ao salvar o arquivo no servidor']);
}
?>

