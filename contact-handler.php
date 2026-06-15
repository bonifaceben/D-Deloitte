<?php
/**
 * Generic mail handler for the D'Deloitte Electrical LTD website forms
 * (request-a-quote bar, contact form, newsletter signup).
 *
 * Update $to_email below to the address that should receive submissions.
 */

$to_email = 'info@ddeloitteelectrical.com.ng';

function field($name) {
    return isset($_POST[$name]) ? trim($_POST[$name]) : '';
}

// Strip characters that could be used for header injection
function clean_header($value) {
    return str_replace(["\r", "\n"], '', $value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$redirect = field('redirect') !== '' ? field('redirect') : 'index.html';

// Honeypot field - real visitors never fill this in
if (field('website') !== '') {
    header('Location: ' . $redirect);
    exit;
}

$form_type = field('form_type');
$name      = field('name');
$email     = field('email');
$phone     = field('phone');

switch ($form_type) {
    case 'contact':
        $subject_field = field('subject');
        $message       = field('message');
        $subject = 'Website Contact Form: ' . ($subject_field !== '' ? $subject_field : 'New message from ' . $name);
        $body  = "New message from the Contact page\n\n";
        $body .= "Name: $name\n";
        $body .= "Email: $email\n";
        $body .= "Phone: $phone\n";
        $body .= "Subject: $subject_field\n\n";
        $body .= "Message:\n$message\n";
        break;

    case 'newsletter':
        $subject = 'New Newsletter Subscription';
        $body  = "A visitor subscribed to the newsletter.\n\n";
        $body .= "Email: $email\n";
        break;

    case 'quote':
    default:
        $need = field('need');
        $subject = 'Website Quote Request from ' . ($name !== '' ? $name : 'a visitor');
        $body  = "New quote request from the website\n\n";
        $body .= "Name: $name\n";
        $body .= "Email: $email\n";
        $body .= "Phone: $phone\n\n";
        $body .= "What they need:\n$need\n";
        break;
}

$host = clean_header($_SERVER['HTTP_HOST'] ?? 'localhost');
$headers = "From: D'Deloitte Electrical Website <noreply@$host>\r\n";
if ($email !== '') {
    $headers .= 'Reply-To: ' . clean_header($email) . "\r\n";
}

$sent = mail($to_email, clean_header($subject), $body, $headers);

// Build the redirect, keeping any #anchor at the end of the query string
$parts    = explode('#', $redirect, 2);
$path     = $parts[0];
$fragment = isset($parts[1]) ? '#' . $parts[1] : '';
$sep      = (strpos($path, '?') === false) ? '?' : '&';
$status   = $sent ? 'sent' : 'error';

header('Location: ' . $path . $sep . $status . '=' . $form_type . $fragment);
exit;
