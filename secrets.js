const SECRET_RULES = [
  // ========== PRIVATE KEY BLOCKS ==========
  { kind: "private_key_block", label: "Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]{40,}?-----END [A-Z ]*PRIVATE KEY-----/g },
  { kind: "ssh_private_key_block", label: "SSH Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]{40,}?-----END OPENSSH PRIVATE KEY-----/g },
  { kind: "pgp_private_key_block", label: "PGP Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN PGP PRIVATE KEY BLOCK-----[\s\S]{40,}?-----END PGP PRIVATE KEY BLOCK-----/g },
  { kind: "rsa_private_key_block", label: "RSA Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN RSA PRIVATE KEY-----[\s\S]{40,}?-----END RSA PRIVATE KEY-----/g },
  { kind: "ec_private_key_block", label: "EC Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN EC PRIVATE KEY-----[\s\S]{40,}?-----END EC PRIVATE KEY-----/g },
  { kind: "dsa_private_key_block", label: "DSA Private Key Block", severity: 6, confidence: "high", regex: /-----BEGIN DSA PRIVATE KEY-----[\s\S]{40,}?-----END DSA PRIVATE KEY-----/g },

  // ========== AWS ==========
  { kind: "aws_access_key_id", label: "AWS Access Key ID", severity: 5, confidence: "high", regex: /\bAKIA[0-9A-Z]{16}\b/g },
  { kind: "aws_secret_access_key", label: "AWS Secret Access Key", severity: 5, confidence: "high", regex: /\b(?:AWS|AMAZON)?[_-]?SECRET[_-]?ACCESS[_-]?KEY\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{32,})['"`]?/gi, captureGroup: 1 },
  { kind: "aws_session_token", label: "AWS Session Token", severity: 5, confidence: "high", regex: /\b(?:x-amz-security-token|aws[_-]?session[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "aws_temporary_key", label: "AWS Temporary Access Key ID", severity: 5, confidence: "high", regex: /\bASIA[0-9A-Z]{16}\b/g },
  { kind: "aws_account_id", label: "AWS Account ID Context", severity: 2, confidence: "low", regex: /\b(?:aws[_-]?account[_-]?id|account[_-]?id)\b\s*[:=]\s*['"`]?(\d{12})['"`]?/gi, captureGroup: 1 },
  { kind: "aws_arn_secret_context", label: "AWS Secret Context", severity: 4, confidence: "medium", regex: /\b(?:aws[_-]?access[_-]?key[_-]?id|aws[_-]?secret[_-]?access[_-]?key|aws[_-]?session[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{12,})['"`]?/gi, captureGroup: 1 },
  { kind: "aws_ecr_login", label: "AWS ECR Login Token", severity: 5, confidence: "medium", regex: /\b(?:aws[_-]?ecr[_-]?login|ecr[_-]?password)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=_-]{100,})['"`]?/gi, captureGroup: 1 },

  // ========== GCP / Google ==========
  { kind: "google_api_key", label: "Google API Key", severity: 5, confidence: "high", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { kind: "gcp_service_account", label: "GCP Service Account JSON", severity: 6, confidence: "high", regex: /"type"\s*:\s*"service_account"[\s\S]{0,500}?"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----[\s\S]{20,}?-----END PRIVATE KEY-----"/g },
  { kind: "gcp_oauth_access_token", label: "Google OAuth Access Token", severity: 4, confidence: "medium", regex: /\bya29\.[0-9A-Za-z\-_]{100,}\b/g },
  { kind: "gcp_service_account_key_id", label: "GCP Service Account Key ID", severity: 4, confidence: "medium", regex: /"private_key_id"\s*:\s*"[a-f0-9]{40}"/g },
  { kind: "gcp_oauth_client_secret", label: "GCP OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b(?:gcp[_-]?client[_-]?secret|google[_-]?client[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "google_service_account_private_key", label: "Google Service Account Private Key", severity: 6, confidence: "high", regex: /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----[\s\S]{40,}?-----END PRIVATE KEY-----"/g },
  { kind: "google_oauth_client_id", label: "Google OAuth Client ID", severity: 2, confidence: "low", regex: /\b[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com\b/g },

  // ========== AZURE ==========
  { kind: "azure_storage_connection_string", label: "Azure Storage Connection String", severity: 5, confidence: "high", regex: /\bDefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+;EndpointSuffix=[^;\s]+/g },
  { kind: "azure_storage_account_key", label: "Azure Storage Account Key", severity: 5, confidence: "high", regex: /\b(?:AccountKey|azure[_-]?storage[_-]?key)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=]{88,})['"`]?/gi, captureGroup: 1 },
  { kind: "azure_sas_token", label: "Azure SAS Token", severity: 5, confidence: "medium", regex: /\bsv=\d{4}-\d{2}-\d{2}&[^"\s]+&sig=[A-Za-z0-9%+=._-]{20,}/g },
  { kind: "azure_client_secret", label: "Azure Client Secret", severity: 5, confidence: "medium", regex: /\b(?:azure[_-]?client[_-]?secret|client[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "azure_devops_pat", label: "Azure DevOps Personal Access Token", severity: 5, confidence: "high", regex: /\b(?:azure[_-]?devops[_-]?pat|devops[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=_-]{52,})['"`]?/gi, captureGroup: 1 },
  { kind: "azure_cognitive_key", label: "Azure Cognitive Services Key", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=\s*$|\s*[,;]|\s*['"]?\s*$)/g },
  { kind: "azure_application_insights_key", label: "Azure Application Insights Key", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/g },

  // ========== CLOUDFLARE ==========
  { kind: "cloudflare_api_token", label: "Cloudflare API Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9_-]{40,}\b(?=\s*$|\s*['"]?$)/g },
  { kind: "cloudflare_global_api_key", label: "Cloudflare Global API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{37}\b/g },
  { kind: "cloudflare_origin_ca_key", label: "Cloudflare Origin CA Key", severity: 6, confidence: "high", regex: /\b-----BEGIN PRIVATE KEY-----[\s\S]{40,}?-----END PRIVATE KEY-----\b/g },
  { kind: "cloudflare_zone_id", label: "Cloudflare Zone ID Context", severity: 2, confidence: "low", regex: /\b[a-f0-9]{32}\b(?=.*cloudflare)/gi },
  { kind: "cloudflare_account_id", label: "Cloudflare Account ID Context", severity: 2, confidence: "low", regex: /\b[a-f0-9]{32}\b(?=.*(?:account|cloudflare))/gi },

  // ========== GITHUB ==========
  { kind: "github_token", label: "GitHub Token", severity: 5, confidence: "high", regex: /\bgh[pousr]_[A-Za-z0-9_]{20,255}\b/g },
  { kind: "github_fine_grained_pat", label: "GitHub Fine-Grained PAT", severity: 5, confidence: "high", regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g },
  { kind: "github_oauth_client_secret", label: "GitHub OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b(?:github[_-]?client[_-]?secret|oauth[_-]?client[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "github_webhook_secret", label: "GitHub Webhook Secret", severity: 5, confidence: "medium", regex: /\b(?:github[_-]?webhook[_-]?secret|webhook[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "github_app_private_key_hint", label: "GitHub App Private Key Hint", severity: 5, confidence: "high", regex: /-----BEGIN RSA PRIVATE KEY-----[\s\S]{40,}?-----END RSA PRIVATE KEY-----/g },
  { kind: "github_installation_token", label: "GitHub App Installation Token", severity: 5, confidence: "medium", regex: /\bv1\.[0-9a-f]{40}\b/g },
  { kind: "github_refresh_token", label: "GitHub OAuth Refresh Token", severity: 5, confidence: "medium", regex: /\bghr_[A-Za-z0-9_]{36,}\b/g },

  // ========== GITLAB ==========
  { kind: "gitlab_pat", label: "GitLab Personal Access Token", severity: 5, confidence: "high", regex: /\bglpat-[A-Za-z0-9_\-]{20,}\b/g },
  { kind: "gitlab_runner_token", label: "GitLab Runner Token", severity: 5, confidence: "medium", regex: /\bglrt-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "gitlab_ci_job_token", label: "GitLab CI Job Token", severity: 4, confidence: "medium", regex: /\bCI_JOB_TOKEN\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "gitlab_trigger_token", label: "GitLab Pipeline Trigger Token", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{20,}\b(?=.*trigger)/gi },
  { kind: "gitlab_oauth_secret", label: "GitLab OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b(?:gitlab[_-]?client[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "gitlab_deploy_token", label: "GitLab Deploy Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9_-]{20,}\b(?=.*deploy[_-]?token)/gi },
  { kind: "gitlab_runner_registration_token", label: "GitLab Runner Registration Token", severity: 5, confidence: "medium", regex: /\bGR1348941[A-Za-z0-9_-]{20,}\b/g },

  // ========== BITBUCKET ==========
  { kind: "bitbucket_app_password", label: "Bitbucket App Password", severity: 5, confidence: "high", regex: /\bATBB[a-zA-Z0-9]{24,}\b/g },
  { kind: "bitbucket_oauth_secret", label: "Bitbucket OAuth Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*bitbucket)/gi },
  { kind: "bitbucket_ssh_key", label: "Bitbucket SSH Key", severity: 6, confidence: "high", regex: /-----BEGIN (?:RSA|OPENSSH) PRIVATE KEY-----[\s\S]{40,}?-----END (?:RSA|OPENSSH) PRIVATE KEY-----/g },
  { kind: "bitbucket_repo_access_token", label: "Bitbucket Repository Access Token", severity: 5, confidence: "high", regex: /\bBBDC-[A-Za-z0-9_-]{20,}\b/g },

  // ========== NPM ==========
  { kind: "npm_token", label: "NPM Token", severity: 5, confidence: "high", regex: /\bnpm_[A-Za-z0-9]{36,}\b/g },
  { kind: "npmrc_auth_token", label: "NPMRC Auth Token", severity: 5, confidence: "high", regex: /\/\/registry\.npmjs\.org\/:_authToken=[A-Za-z0-9._\-~]{20,}/g },
  { kind: "npm_granular_token", label: "NPM Granular Access Token", severity: 5, confidence: "high", regex: /\bnpm_[A-Za-z0-9]{36,}\b/g },

  // ========== SLACK ==========
  { kind: "slack_token", label: "Slack Token", severity: 5, confidence: "high", regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { kind: "slack_webhook_url", label: "Slack Webhook URL", severity: 5, confidence: "high", regex: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]{8,}\/B[A-Z0-9]{8,}\/[A-Za-z0-9]{20,}/g },
  { kind: "slack_signing_secret", label: "Slack Signing Secret", severity: 5, confidence: "high", regex: /\b(?:slack[_-]?signing[_-]?secret|signing[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9]{24,})['"`]?/gi, captureGroup: 1 },
  { kind: "slack_app_token", label: "Slack App Token", severity: 5, confidence: "high", regex: /\bxapp-[A-Za-z0-9-]{10,}\b/g },
  { kind: "slack_bot_token", label: "Slack Bot Token", severity: 5, confidence: "high", regex: /\bxoxb-[A-Za-z0-9-]{10,}\b/g },
  { kind: "slack_user_token", label: "Slack User Token", severity: 5, confidence: "high", regex: /\bxoxp-[A-Za-z0-9-]{10,}\b/g },

  // ========== DISCORD ==========
  { kind: "discord_token", label: "Discord Token", severity: 5, confidence: "high", regex: /\b[MN][A-Za-z\d]{23}\.[A-Za-z\d_-]{6}\.[A-Za-z\d_-]{27}\b/g },
  { kind: "discord_webhook_url", label: "Discord Webhook URL", severity: 5, confidence: "high", regex: /https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d{17,20}\/[A-Za-z0-9_-]{60,}/g },
  { kind: "discord_bot_token", label: "Discord Bot Token", severity: 5, confidence: "high", regex: /\bBot\s+[A-Za-z\d]{24}\.[A-Za-z\d_-]{6}\.[A-Za-z\d_-]{27}\b/g },
  { kind: "discord_client_secret", label: "Discord OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9_-]{32}\b(?=.*discord)/gi },

  // ========== STRIPE ==========
  { kind: "stripe_secret", label: "Stripe Secret Key", severity: 5, confidence: "high", regex: /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/g },
  { kind: "stripe_restricted", label: "Stripe Restricted Key", severity: 5, confidence: "high", regex: /\brk_(?:live|test)_[A-Za-z0-9]{16,}\b/g },
  { kind: "stripe_webhook_secret", label: "Stripe Webhook Secret", severity: 5, confidence: "high", regex: /\bwhsec_[A-Za-z0-9]{24,}\b/g },
  { kind: "stripe_publishable_key", label: "Stripe Publishable Key", severity: 2, confidence: "low", regex: /\bpk_(?:live|test)_[A-Za-z0-9]{16,}\b/g },

  // ========== OPENAI ==========
  { kind: "openai_key", label: "OpenAI API Key", severity: 5, confidence: "high", regex: /\b(sk-(?:proj-)?[A-Za-z0-9_-]{20,})\b/g, captureGroup: 1 },
  { kind: "openai_admin_key", label: "OpenAI Admin Key", severity: 5, confidence: "high", regex: /\bsk-admin-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "openai_api_base", label: "OpenAI API Base Context", severity: 3, confidence: "medium", regex: /\b(?:openai[_-]?api[_-]?key|openai[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{20,})['"`]?/gi, captureGroup: 1 },

  // ========== ANTHROPIC ==========
  { kind: "anthropic_key", label: "Anthropic API Key", severity: 5, confidence: "high", regex: /\bsk-ant-api[0-9]+-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "anthropic_admin_key", label: "Anthropic Admin Key", severity: 5, confidence: "medium", regex: /\bsk-ant-admin-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "anthropic_api_base", label: "Anthropic Key Context", severity: 3, confidence: "medium", regex: /\b(?:anthropic[_-]?api[_-]?key|anthropic[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{20,})['"`]?/gi, captureGroup: 1 },

  // ========== OTHER AI PROVIDERS ==========
  { kind: "groq_key", label: "Groq API Key", severity: 5, confidence: "high", regex: /\bgsk_[A-Za-z0-9]{20,}\b/g },
  { kind: "huggingface_token", label: "HuggingFace Token", severity: 4, confidence: "medium", regex: /\bhf_[A-Za-z0-9]{20,}\b/g },
  { kind: "cohere_key", label: "Cohere API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*cohere)/gi },
  { kind: "ai21_key", label: "AI21 API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*ai21)/gi },
  { kind: "replicate_key", label: "Replicate API Key", severity: 5, confidence: "high", regex: /\br8_[A-Za-z0-9]{20,}\b/g },
  { kind: "stability_key", label: "Stability AI Key", severity: 5, confidence: "high", regex: /\bsk-[A-Za-z0-9]{40,}\b/g },
  { kind: "mistral_key", label: "Mistral API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*mistral)/gi },
  { kind: "deepseek_key", label: "DeepSeek API Key", severity: 5, confidence: "high", regex: /\bdeepseek-[A-Za-z0-9]{20,}\b/g },
  { kind: "perplexity_key", label: "Perplexity API Key", severity: 5, confidence: "high", regex: /\bpplx-[A-Za-z0-9]{20,}\b/g },
  { kind: "together_key", label: "Together AI Key", severity: 5, confidence: "high", regex: /\btogether[A-Za-z0-9]{20,}\b/g },
  { kind: "assemblyai_key", label: "AssemblyAI API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}\b(?=.*assemblyai)/gi },

  // ========== TWILIO ==========
  { kind: "twilio_sid", label: "Twilio Account SID", severity: 4, confidence: "medium", regex: /\bAC[0-9a-fA-F]{32}\b/g },
  { kind: "twilio_auth_token", label: "Twilio Auth Token", severity: 5, confidence: "high", regex: /\b(?:twilio[_-]?auth[_-]?token|auth[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9]{32,})['"`]?/gi, captureGroup: 1 },
  { kind: "twilio_api_key", label: "Twilio API Key", severity: 5, confidence: "high", regex: /\bSK[0-9a-fA-F]{32}\b/g },
  { kind: "twilio_api_secret", label: "Twilio API Secret", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*twilio.*secret)/gi },

  // ========== SENDGRID ==========
  { kind: "sendgrid_key", label: "SendGrid API Key", severity: 5, confidence: "high", regex: /\bSG\.[A-Za-z0-9_-]{22,}\.[A-Za-z0-9_-]{22,}\b/g },
  { kind: "sendgrid_bearer", label: "SendGrid Bearer Token", severity: 5, confidence: "high", regex: /Bearer\s+([A-Za-z0-9_-]{22,}\.[A-Za-z0-9_-]{22,})/gi, captureGroup: 1 },

  // ========== MAILGUN ==========
  { kind: "mailgun_key", label: "Mailgun API Key", severity: 5, confidence: "high", regex: /\bkey-[a-f0-9]{32}\b/g },
  { kind: "mailgun_smtp_password", label: "Mailgun SMTP Password", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*mailgun)/gi },

  // ========== MAILCHIMP ==========
  { kind: "mailchimp_api_key", label: "Mailchimp API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}-us\d+\b/g },

  // ========== POSTMARK ==========
  { kind: "postmark_server_token", label: "Postmark Server Token", severity: 5, confidence: "high", regex: /\b(?:POSTMARK_API_TEST|POSTMARK_API_KEY)\b\s*[:=]\s*['"`]?([A-Za-z0-9-]{20,})['"`]?/gi, captureGroup: 1 },
  { kind: "postmark_account_token", label: "Postmark Account Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{36,}\b(?=.*postmark)/gi },

  // ========== RESEND ==========
  { kind: "resend_api_key", label: "Resend API Key", severity: 5, confidence: "high", regex: /\bre_[A-Za-z0-9]{24,}\b/g },

  // ========== SENDINBLUE / BREVO ==========
  { kind: "sendinblue_key", label: "Brevo/Sendinblue Key", severity: 5, confidence: "high", regex: /\bxkeysib-[A-Za-z0-9-]{32,}\b/g },
  { kind: "brevo_smtp_key", label: "Brevo SMTP Key", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{64}\b(?=.*brevo)/gi },

  // ========== OTHER EMAIL PROVIDERS ==========
  { kind: "mailjet_key", label: "Mailjet API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}\b(?=.*mailjet)/gi },
  { kind: "mailjet_secret", label: "Mailjet Secret Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}\b(?=.*mailjet.*secret)/gi },
  { kind: "sparkpost_key", label: "SparkPost API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{40}\b(?=.*sparkpost)/gi },
  { kind: "elasticemail_key", label: "Elastic Email API Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{40,}\b(?=.*elasticemail)/gi },
  { kind: "amazon_ses_smtp", label: "Amazon SES SMTP Password", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9+/]{44,}\b(?=.*email-smtp)/gi },

  // ========== TELEGRAM ==========
  { kind: "telegram_bot_token", label: "Telegram Bot Token", severity: 5, confidence: "high", regex: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g },
  { kind: "telegram_api_id", label: "Telegram API ID", severity: 3, confidence: "medium", regex: /\b(?:api[_-]?id)\b\s*[:=]\s*['"`]?(\d{5,10})['"`]?/gi, captureGroup: 1 },
  { kind: "telegram_api_hash", label: "Telegram API Hash", severity: 4, confidence: "medium", regex: /\b(?:api[_-]?hash)\b\s*[:=]\s*['"`]?([a-f0-9]{32,})['"`]?/gi, captureGroup: 1 },

  // ========== NOTION ==========
  { kind: "notion_secret", label: "Notion Secret", severity: 5, confidence: "high", regex: /\bsecret_[A-Za-z0-9]{43}\b/g },
  { kind: "notion_integration_secret", label: "Notion Integration Secret", severity: 5, confidence: "high", regex: /\bsecret_[A-Za-z0-9]{43}\b/g },

  // ========== FIREBASE ==========
  { kind: "firebase_api_key", label: "Firebase API Key", severity: 4, confidence: "medium", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { kind: "firebase_config_key", label: "Firebase Config Value", severity: 4, confidence: "medium", regex: /(?:apiKey|authDomain|databaseURL|projectId|storageBucket|messagingSenderId|appId)\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, captureGroup: 1 },
  { kind: "firebase_service_account", label: "Firebase Service Account JSON", severity: 6, confidence: "high", regex: /"type"\s*:\s*"service_account"[\s\S]{0,500}?"client_email"\s*:\s*"[^"]+@[^"]+\.iam\.gserviceaccount\.com"/g },
  { kind: "firebase_credential", label: "Firebase Credential", severity: 4, confidence: "medium", regex: /(?:apiKey|authDomain|databaseURL|projectId|storageBucket|messagingSenderId|appId)\s*[:=]\s*['"`]([^'"`]{10,})['"`]/gi, captureGroup: 1 },

  // ========== SUPABASE ==========
  { kind: "supabase_service_role", label: "Supabase Service Role Key", severity: 5, confidence: "high", regex: /\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{100,}\.(?:[A-Za-z0-9_-]{43,})\b/g },
  { kind: "supabase_anon_key", label: "Supabase Anon Key", severity: 4, confidence: "medium", regex: /\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{60,}\.(?:[A-Za-z0-9_-]{43,})\b/g },
  { kind: "supabase_service_role_json_hint", label: "Supabase Service Role JSON Hint", severity: 5, confidence: "high", regex: /"supabase(?:_)?service(?:_)?role"|service_role|anon_key|project_ref/g },

  // ========== ALGOLIA ==========
  { kind: "algolia_admin_key", label: "Algolia Admin Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*algolia)/gi },
  { kind: "algolia_app_id", label: "Algolia App ID", severity: 3, confidence: "medium", regex: /\b[A-Z0-9]{10}\b/g },
  { kind: "algolia_search_only_key", label: "Algolia Search Key", severity: 2, confidence: "low", regex: /\b[a-f0-9]{32}-us\d+\b/g },

  // ========== VERCEL ==========
  { kind: "vercel_token", label: "Vercel Token", severity: 5, confidence: "high", regex: /\bvercel_[A-Za-z0-9]{24,}\b/g },
  { kind: "vercel_project_id", label: "Vercel Project ID", severity: 2, confidence: "low", regex: /\bprj_[A-Za-z0-9]{24,}\b/g },
  { kind: "vercel_deploy_hook", label: "Vercel Deploy Hook", severity: 5, confidence: "high", regex: /https:\/\/api\.vercel\.com\/v1\/integrations\/deploy\/[A-Za-z0-9_\-]{20,}\/[A-Za-z0-9]{20,}/g },

  // ========== NETLIFY ==========
  { kind: "netlify_token", label: "Netlify Token", severity: 5, confidence: "high", regex: /\b(nfp_[A-Za-z0-9]{24,}|netlify[_-]?token)\b/gi },
  { kind: "netlify_site_id", label: "Netlify Site ID Context", severity: 2, confidence: "low", regex: /\b[a-f0-9-]{36}\b(?=.*netlify)/gi },

  // ========== HEROKU ==========
  { kind: "heroku_api_key", label: "Heroku API Key", severity: 5, confidence: "high", regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b(?=.*heroku)/gi },
  { kind: "heroku_oauth_secret", label: "Heroku OAuth Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*heroku)/gi },

  // ========== DIGITALOCEAN ==========
  { kind: "digitalocean_token", label: "DigitalOcean API Token", severity: 5, confidence: "high", regex: /\bdop_v1_[a-f0-9]{64}\b/g },
  { kind: "digitalocean_spaces_key", label: "DigitalOcean Spaces Key", severity: 5, confidence: "medium", regex: /\bDO00[A-Z0-9]{20,}\b/g },
  { kind: "digitalocean_spaces_secret", label: "DigitalOcean Spaces Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9\/+=]{40,}\b(?=.*digitalocean)/gi },

  // ========== LINODE ==========
  { kind: "linode_token", label: "Linode API Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{64}\b(?=.*linode)/gi },
  { kind: "linode_oauth_secret", label: "Linode OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{40}\b(?=.*linode)/gi },

  // ========== PAYPAL ==========
  { kind: "paypal_client_id", label: "PayPal Client ID", severity: 4, confidence: "medium", regex: /\bA[A-Za-z0-9]{80,}\b/g },
  { kind: "paypal_client_secret", label: "PayPal Client Secret", severity: 5, confidence: "medium", regex: /\bE[A-Za-z0-9]{80,}\b/g },
  { kind: "paypal_access_token", label: "PayPal Access Token", severity: 5, confidence: "medium", regex: /\baccess_token\$[A-Za-z0-9]{80,}\b/g },

  // ========== BRAINTREE ==========
  { kind: "braintree_public_key", label: "Braintree Public Key", severity: 3, confidence: "low", regex: /\b[a-z0-9]{16,}\b(?=.*braintree)/gi },
  { kind: "braintree_private_key", label: "Braintree Private Key", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*braintree)/gi },
  { kind: "braintree_merchant_id", label: "Braintree Merchant ID", severity: 3, confidence: "low", regex: /\b[a-z0-9]{16}\b(?=.*braintree.*merchant)/gi },

  // ========== SQUARE ==========
  { kind: "square_access_token", label: "Square Access Token", severity: 5, confidence: "high", regex: /\bEAAAE[A-Za-z0-9_-]{50,}\b/g },
  { kind: "square_application_secret", label: "Square Application Secret", severity: 5, confidence: "medium", regex: /\bsq0csp-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "square_webhook_signature", label: "Square Webhook Signature Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{43}\b(?=.*square)/gi },

  // ========== RAZORPAY ==========
  { kind: "razorpay_key_id", label: "Razorpay Key ID", severity: 3, confidence: "low", regex: /\brzp_(?:live|test)_[A-Za-z0-9]{10,}\b/g },
  { kind: "razorpay_key_secret", label: "Razorpay Key Secret", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{24,}\b(?=.*razorpay)/gi },

  // ========== SHOPIFY ==========
  { kind: "shopify_admin_token", label: "Shopify Admin API Token", severity: 5, confidence: "high", regex: /\bshpat_[a-f0-9]{32}\b/g },
  { kind: "shopify_storefront_token", label: "Shopify Storefront Token", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*shopify)/gi },
  { kind: "shopify_private_app_password", label: "Shopify Private App Password", severity: 5, confidence: "medium", regex: /\bshppa_[a-f0-9]{32}\b/g },
  { kind: "shopify_webhook_secret", label: "Shopify Webhook Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*shopify.*webhook)/gi },

  // ========== HUBSPOT ==========
  { kind: "hubspot_api_key", label: "HubSpot API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b(?=.*hubspot)/gi },
  { kind: "hubspot_private_app_token", label: "HubSpot Private App Token", severity: 5, confidence: "high", regex: /\bpat-[A-Za-z0-9]{20,}\b/g },

  // ========== AIRTABLE ==========
  { kind: "airtable_api_key", label: "Airtable API Key", severity: 5, confidence: "high", regex: /\bkey[A-Za-z0-9]{14,}\b/g },
  { kind: "airtable_pat", label: "Airtable Personal Access Token", severity: 5, confidence: "high", regex: /\bpat[A-Za-z0-9]{14,}\b/g },
  { kind: "airtable_base_id", label: "Airtable Base ID Context", severity: 2, confidence: "low", regex: /\bapp[A-Za-z0-9]{14,}\b/g },

  // ========== LINEAR ==========
  { kind: "linear_api_key", label: "Linear API Key", severity: 4, confidence: "medium", regex: /\blin_api_[a-f0-9]{32}\b/g },
  { kind: "linear_oauth_secret", label: "Linear OAuth Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*linear)/gi },

  // ========== CLOUDINARY ==========
  { kind: "cloudinary_url", label: "Cloudinary Credentialed URL", severity: 5, confidence: "high", regex: /\bcloudinary:\/\/[A-Za-z0-9]+:[A-Za-z0-9_-]+@[^/\s]+/gi },
  { kind: "cloudinary_api_secret", label: "Cloudinary API Secret", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9_-]{20,}\b(?=.*cloudinary)/gi },

  // ========== SENTRY ==========
  { kind: "sentry_dsn", label: "Sentry DSN", severity: 3, confidence: "medium", regex: /\bhttps:\/\/[^/\s]+@[^/\s]+\/\d+\b/g },
  { kind: "sentry_auth_token", label: "Sentry Auth Token", severity: 5, confidence: "medium", regex: /\b(?:sentry[_-]?auth[_-]?token|auth[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "sentry_org_token", label: "Sentry Organization Auth Token", severity: 5, confidence: "medium", regex: /\bsntrys_[A-Za-z0-9]{20,}\b/g },

  // ========== MAPBOX ==========
  { kind: "mapbox_secret_token", label: "Mapbox Secret Token", severity: 5, confidence: "medium", regex: /\bsk\.[A-Za-z0-9_-]{40,}\b/g },
  { kind: "mapbox_public_token", label: "Mapbox Public Token", severity: 2, confidence: "low", regex: /\bpk\.[A-Za-z0-9_-]{40,}\b/g },

  // ========== OKTA ==========
  { kind: "okta_api_token", label: "Okta API Token", severity: 5, confidence: "medium", regex: /\b(?:okta[_-]?api[_-]?token|okta[_-]?token)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{20,})['"`]?/gi, captureGroup: 1 },
  { kind: "okta_oauth_secret", label: "Okta OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{40,}\b(?=.*okta)/gi },
  { kind: "okta_domain", label: "Okta Domain Context", severity: 2, confidence: "low", regex: /\b[a-z0-9-]+\.okta\.com\b/g },

  // ========== AUTH0 ==========
  { kind: "auth0_client_secret", label: "Auth0 Client Secret", severity: 5, confidence: "medium", regex: /\b(?:auth0[_-]?client[_-]?secret|client[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "auth0_management_token", label: "Auth0 Management API Token", severity: 5, confidence: "high", regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9._-]{8,}\.[A-Za-z0-9._-]{8,}\b/g },
  { kind: "auth0_domain", label: "Auth0 Domain Context", severity: 2, confidence: "low", regex: /\b[a-z0-9-]+\.auth0\.com\b/g },

  // ========== CLERK ==========
  { kind: "clerk_secret_key", label: "Clerk Secret Key", severity: 5, confidence: "high", regex: /\bsk_live_[A-Za-z0-9]{20,}\b/g },
  { kind: "clerk_publishable_key", label: "Clerk Publishable Key", severity: 2, confidence: "low", regex: /\bpk_live_[A-Za-z0-9]{20,}\b/g },
  { kind: "clerk_jwt_key", label: "Clerk JWT Verification Key", severity: 5, confidence: "medium", regex: /-----BEGIN PUBLIC KEY-----[\s\S]{20,}?-----END PUBLIC KEY-----/g },

  // ========== DATADOG ==========
  { kind: "datadog_api_key", label: "Datadog API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}\b(?=.*datadog)/gi },
  { kind: "datadog_app_key", label: "Datadog Application Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{40}\b(?=.*datadog)/gi },

  // ========== NEW RELIC ==========
  { kind: "newrelic_license_key", label: "New Relic License Key", severity: 5, confidence: "high", regex: /\bNR[A-Z0-9]{39}\b/g },
  { kind: "newrelic_api_key", label: "New Relic API Key", severity: 5, confidence: "high", regex: /\bNRAK-[A-Z0-9]{20,}\b/g },
  { kind: "newrelic_insert_key", label: "New Relic Insights Insert Key", severity: 5, confidence: "medium", regex: /\bNRII-[A-Z0-9]{20,}\b/g },

  // ========== ZOOM ==========
  { kind: "zoom_jwt_token", label: "Zoom JWT Token", severity: 5, confidence: "medium", regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9._-]{8,}\.[A-Za-z0-9._-]{8,}\b/g },
  { kind: "zoom_oauth_secret", label: "Zoom OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*zoom)/gi },
  { kind: "zoom_server_to_server_oauth", label: "Zoom Server-to-Server OAuth", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*zoom.*account)/gi },

  // ========== TRELLO ==========
  { kind: "trello_api_key", label: "Trello API Key", severity: 3, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*trello)/gi },
  { kind: "trello_token", label: "Trello Token", severity: 4, confidence: "medium", regex: /\b[a-f0-9]{64}\b(?=.*trello)/gi },
  { kind: "trello_oauth_secret", label: "Trello OAuth Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{64}\b(?=.*trello.*secret)/gi },

  // ========== ASANA ==========
  { kind: "asana_pat", label: "Asana Personal Access Token", severity: 5, confidence: "high", regex: /\b1\/[0-9]+:[A-Za-z0-9]{32}\b/g },
  { kind: "asana_oauth_secret", label: "Asana OAuth Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*asana)/gi },

  // ========== SALESFORCE ==========
  { kind: "salesforce_access_token", label: "Salesforce Access Token", severity: 5, confidence: "high", regex: /\b00D[A-Za-z0-9]{12,}![A-Za-z0-9]{20,}\b/g },
  { kind: "salesforce_consumer_secret", label: "Salesforce Consumer Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*salesforce)/gi },
  { kind: "salesforce_jwt_secret", label: "Salesforce JWT Secret", severity: 5, confidence: "medium", regex: /-----BEGIN PRIVATE KEY-----[\s\S]{40,}?-----END PRIVATE KEY-----/g },

  // ========== ZENDESK ==========
  { kind: "zendesk_api_token", label: "Zendesk API Token", severity: 5, confidence: "high", regex: /\b[a-z0-9]{40}\b(?=.*zendesk)/gi },
  { kind: "zendesk_oauth_secret", label: "Zendesk OAuth Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*zendesk)/gi },
  { kind: "zendesk_subdomain", label: "Zendesk Subdomain Context", severity: 2, confidence: "low", regex: /\b[a-z0-9]+\.zendesk\.com\b/g },

  // ========== DOCKER ==========
  { kind: "docker_pat", label: "Docker Personal Access Token", severity: 5, confidence: "high", regex: /\bdckr_pat_[A-Za-z0-9_-]{20,}\b/g },
  { kind: "docker_access_token", label: "Docker Access Token", severity: 5, confidence: "medium", regex: /\bdckr_[A-Za-z0-9_-]{20,}\b/g },
  { kind: "docker_hub_password", label: "Docker Hub Password", severity: 5, confidence: "medium", regex: /\b(?:docker[_-]?hub[_-]?password|docker[_-]?password)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{8,})['"`]?/gi, captureGroup: 1 },

  // ========== KUBERNETES ==========
  { kind: "k8s_config_token", label: "Kubernetes Config Token", severity: 5, confidence: "medium", regex: /\btoken:\s*([A-Za-z0-9._-]{20,})/g, captureGroup: 1 },
  { kind: "k8s_certificate_authority", label: "Kubernetes Certificate Authority", severity: 5, confidence: "high", regex: /-----BEGIN CERTIFICATE-----[\s\S]{20,}?-----END CERTIFICATE-----/g },
  { kind: "k8s_client_key", label: "Kubernetes Client Key", severity: 6, confidence: "high", regex: /-----BEGIN RSA PRIVATE KEY-----[\s\S]{40,}?-----END RSA PRIVATE KEY-----/g },

  // ========== CI/CD ==========
  { kind: "circleci_token", label: "CircleCI API Token", severity: 5, confidence: "high", regex: /\b[a-f0-9]{40}\b(?=.*circleci)/gi },
  { kind: "circleci_project_token", label: "CircleCI Project Token", severity: 5, confidence: "medium", regex: /\bccpt_[A-Za-z0-9]{20,}\b/g },
  { kind: "travisci_token", label: "Travis CI Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{20,}\b(?=.*travis)/gi },
  { kind: "jenkins_apitoken", label: "Jenkins API Token", severity: 5, confidence: "medium", regex: /\b[a-f0-9]{32}\b(?=.*jenkins)/gi },
  { kind: "jenkins_credential", label: "Jenkins Credential ID", severity: 4, confidence: "medium", regex: /\b(?:jenkins[_-]?token|jenkins[_-]?credential)\b\s*[:=]\s*['"`]?([A-Za-z0-9_-]{16,})['"`]?/gi, captureGroup: 1 },
  { kind: "codecov_token", label: "Codecov Upload Token", severity: 5, confidence: "high", regex: /\b[a-f0-9]{36}\b(?=.*codecov)/gi },
  { kind: "coveralls_token", label: "Coveralls Repo Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32}\b(?=.*coveralls)/gi },
  { kind: "drone_token", label: "Drone CI Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*drone)/gi },
  { kind: "teamcity_token", label: "TeamCity Access Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*teamcity)/gi },
  { kind: "bamboo_token", label: "Bamboo Personal Access Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*bamboo)/gi },

  // ========== DATABASES ==========
  { kind: "redis_uri", label: "Redis URI", severity: 5, confidence: "high", regex: /\bredis:\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "mongodb_uri", label: "MongoDB URI", severity: 5, confidence: "high", regex: /\bmongodb(?:\+srv)?:\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "postgres_uri", label: "Postgres URI", severity: 5, confidence: "high", regex: /\bpostgres(?:ql)?:\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "mysql_uri", label: "MySQL URI", severity: 5, confidence: "high", regex: /\bmysql:\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "amqp_uri", label: "AMQP URI", severity: 4, confidence: "medium", regex: /\bamqps?:\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "elasticsearch_url", label: "Elasticsearch Credentialed URL", severity: 5, confidence: "high", regex: /\bhttps?:\/\/[^/\s]+:[^@\s]+@[^/\s]+:\d+\b/g },
  { kind: "snowflake_password", label: "Snowflake Password", severity: 5, confidence: "medium", regex: /\b(?:snowflake[_-]?password|snowflake[_-]?pwd)\b\s*[:=]\s*['"`]?([^'"`\s]{8,})['"`]?/gi, captureGroup: 1 },
  { kind: "snowflake_account", label: "Snowflake Account Context", severity: 3, confidence: "low", regex: /\b[A-Z0-9]{2,8}\.[A-Z0-9_]{2,20}\.aws\b/g },
  { kind: "databricks_token", label: "Databricks Personal Access Token", severity: 5, confidence: "high", regex: /\bdapi[a-f0-9]{32,}\b/g },
  { kind: "confluent_api_key", label: "Confluent Cloud API Key", severity: 5, confidence: "high", regex: /\b[A-Z0-9]{16}\b(?=.*confluent)/gi },
  { kind: "confluent_api_secret", label: "Confluent Cloud API Secret", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9/+]{40,}\b(?=.*confluent)/gi },
  { kind: "astra_db_token", label: "Astra DB Token", severity: 5, confidence: "high", regex: /\bAstraCS:[A-Za-z0-9]{20,}\b/g },
  { kind: "aiven_token", label: "Aiven API Token", severity: 5, confidence: "high", regex: /\b[a-f0-9]{64}\b(?=.*aiven)/gi },
  { kind: "upstash_token", label: "Upstash Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{24,}\b(?=.*upstash)/gi },
  { kind: "neon_api_key", label: "Neon API Key", severity: 5, confidence: "high", regex: /\bneon_[A-Za-z0-9]{32,}\b/g },
  { kind: "planetscale_token", label: "PlanetScale Service Token", severity: 5, confidence: "high", regex: /\bpscale_[A-Za-z0-9]{20,}\b/g },
  { kind: "planetscale_username", label: "PlanetScale Username Token", severity: 5, confidence: "medium", regex: /\bpscale_tkn_[A-Za-z0-9]{20,}\b/g },
  { kind: "planetscale_password", label: "PlanetScale Password", severity: 5, confidence: "medium", regex: /\bpscale_pw_[A-Za-z0-9]{20,}\b/g },
  { kind: "cockroachdb_url", label: "CockroachDB Connection URL", severity: 5, confidence: "high", regex: /\bpostgresql:\/\/[^/\s]+:[^@\s]+@[^/\s]+:\d+\b/g },
  { kind: "cassandra_password", label: "Cassandra Password Context", severity: 4, confidence: "medium", regex: /\b(?:cassandra[_-]?password|cassandra[_-]?pwd)\b\s*[:=]\s*['"`]?([^'"`\s]{8,})['"`]?/gi, captureGroup: 1 },

  // ========== BASIC AUTH / URL CREDENTIALS ==========
  { kind: "basic_auth_url", label: "Credentialed URL", severity: 5, confidence: "high", regex: /\b[a-z][a-z0-9+.-]*:\/\/[^/\s:@]+:[^@\s]+@[^/\s]+/gi },
  { kind: "db_uri", label: "Credentialed DB URI", severity: 5, confidence: "high", regex: /\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^/\s]+:[^@\s]+@[^/\s]+/gi },
  { kind: "basic_auth_header", label: "Basic Auth Header", severity: 5, confidence: "medium", regex: /\bauthorization\b\s*:\s*basic\s+([A-Za-z0-9+/=]{8,})/gi, captureGroup: 1 },

  // ========== JWT ==========
  { kind: "jwt", label: "JWT", severity: 3, confidence: "medium", regex: /\beyJ[a-zA-Z0-9_-]{8,}\.[a-zA-Z0-9._-]{8,}\.[a-zA-Z0-9._-]{8,}\b/g },
  { kind: "jwt_secret_context", label: "JWT Secret Context", severity: 4, confidence: "medium", regex: /\b(?:jwt[_-]?secret|token[_-]?secret|signing[_-]?secret)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{12,})['"`]?/gi, captureGroup: 1 },

  // ========== WEBHOOK URLS ==========
  { kind: "slack_webhook_url", label: "Slack Webhook URL", severity: 5, confidence: "high", regex: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]{8,}\/B[A-Z0-9]{8,}\/[A-Za-z0-9]{20,}/g },
  { kind: "discord_webhook_url", label: "Discord Webhook URL", severity: 5, confidence: "high", regex: /https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d{17,20}\/[A-Za-z0-9_-]{60,}/g },
  { kind: "teams_webhook_url", label: "Microsoft Teams Webhook URL", severity: 4, confidence: "medium", regex: /https:\/\/[^/\s]+\.webhook\.office\.com\/webhookb2\/[A-Za-z0-9-]{36}@[A-Za-z0-9-]{36}\/IncomingWebhook\/[A-Za-z0-9]{32,}\/[A-Za-z0-9-]{36}/g },
  { kind: "generic_webhook_url", label: "Generic Webhook URL", severity: 3, confidence: "low", regex: /https?:\/\/[^/\s]+\/(?:webhook|hook|callback)\/[A-Za-z0-9_-]{20,}/gi },

  // ========== CONTEXTUAL / GENERIC ==========
  { kind: "context_secret", label: "Contextual Secret", severity: 4, confidence: "medium", regex: /\b(?:api[_-]?key|apikey|client[_-]?secret|clientSecret|access[_-]?token|accessToken|refresh[_-]?token|refreshToken|secret|token|password|passwd|private[_-]?key|x-api-key|x-api-token|authorization)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._:-]{8,256})['"`]?/gi, captureGroup: 1 },
  { kind: "api_token_context", label: "API Token", severity: 4, confidence: "medium", regex: /\b(?:api[_-]?token|access[_-]?token|refresh[_-]?token|bearer|token)\b\s*[:=]\s*['"`]?([A-Za-z0-9\/+=._-]{12,256})['"`]?/gi, captureGroup: 1 },

  // ========== ADDITIONAL SAAS ==========
  { kind: "pagerduty_api_key", label: "PagerDuty API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{20,}\b(?=.*pagerduty)/gi },
  { kind: "pagerduty_integration_key", label: "PagerDuty Integration Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32}\b(?=.*pagerduty)/gi },
  { kind: "opsgenie_api_key", label: "Opsgenie API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9-]{36,}\b(?=.*opsgenie)/gi },
  { kind: "statuspage_api_key", label: "Statuspage API Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*statuspage)/gi },
  { kind: "figma_pat", label: "Figma Personal Access Token", severity: 5, confidence: "high", regex: /\bfigd_[A-Za-z0-9]{20,}\b/g },
  { kind: "figma_oauth_secret", label: "Figma OAuth Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*figma)/gi },
  { kind: "microsoft_teams_bot_token", label: "Microsoft Teams Bot Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*teams.*bot)/gi },
  { kind: "dropbox_access_token", label: "Dropbox Access Token", severity: 5, confidence: "high", regex: /\bsl\.[A-Za-z0-9_-]{50,}\b/g },
  { kind: "dropbox_app_secret", label: "Dropbox App Secret", severity: 5, confidence: "medium", regex: /\b[a-z0-9]{15,}\b(?=.*dropbox)/gi },
  { kind: "box_developer_token", label: "Box Developer Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*box)/gi },
  { kind: "box_client_secret", label: "Box Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*box.*secret)/gi },
  { kind: "intercom_access_token", label: "Intercom Access Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*intercom)/gi },
  { kind: "pipedrive_api_token", label: "Pipedrive API Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*pipedrive)/gi },
  { kind: "freshdesk_api_key", label: "Freshdesk API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{20,}\b(?=.*freshdesk)/gi },
  { kind: "monday_api_token", label: "Monday.com API Token", severity: 5, confidence: "high", regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9._-]{8,}\.[A-Za-z0-9._-]{8,}\b/g },
  { kind: "clickup_api_token", label: "ClickUp API Token", severity: 5, confidence: "high", regex: /\bpk_[A-Za-z0-9]{20,}\b/g },
  { kind: "todoist_api_token", label: "Todoist API Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*todoist)/gi },
  { kind: "evernote_developer_token", label: "Evernote Developer Token", severity: 5, confidence: "medium", regex: /\bS=s[0-9]+:[A-Za-z0-9]{32,}\b/g },
  { kind: "typeform_api_token", label: "Typeform API Token", severity: 5, confidence: "high", regex: /\btfp_[A-Za-z0-9]{20,}\b/g },
  { kind: "contentful_delivery_token", label: "Contentful Delivery Token", severity: 4, confidence: "medium", regex: /\b[A-Za-z0-9_-]{43}\b(?=.*contentful)/gi },
  { kind: "contentful_management_token", label: "Contentful Management Token", severity: 5, confidence: "high", regex: /\bCFPAT-[A-Za-z0-9_-]{20,}\b/g },
  { kind: "sanity_token", label: "Sanity API Token", severity: 5, confidence: "high", regex: /\bsk[A-Za-z0-9]{40,}\b/g },
  { kind: "aircall_api_key", label: "Aircall API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*aircall)/gi },
  { kind: "calendly_api_key", label: "Calendly API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*calendly)/gi },
  { kind: "docusign_integrator_key", label: "DocuSign Integrator Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9-]{36}\b(?=.*docusign)/gi },
  { kind: "docusign_oauth_secret", label: "DocuSign OAuth Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9+/]{32,}\b(?=.*docusign)/gi },
  { kind: "lob_api_key", label: "Lob API Key", severity: 5, confidence: "high", regex: /\blive_[A-Za-z0-9]{20,}\b/g },
  { kind: "plaid_client_id", label: "Plaid Client ID", severity: 3, confidence: "low", regex: /\b[a-f0-9]{24}\b(?=.*plaid)/gi },
  { kind: "plaid_secret", label: "Plaid Secret", severity: 5, confidence: "high", regex: /\b[a-f0-9]{30}\b(?=.*plaid)/gi },
  { kind: "plaid_access_token", label: "Plaid Access Token", severity: 5, confidence: "medium", regex: /\baccess-sandbox-[A-Za-z0-9-]{36}\b/g },
  { kind: "alchemy_api_key", label: "Alchemy API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9_-]{32,}\b(?=.*alchemy)/gi },
  { kind: "infura_api_key", label: "Infura API Key", severity: 5, confidence: "high", regex: /\b[a-f0-9]{32}\b(?=.*infura)/gi },
  { kind: "infura_secret", label: "Infura Secret", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*infura)/gi },
  { kind: "etherscan_api_key", label: "Etherscan API Key", severity: 5, confidence: "medium", regex: /\b[A-Z0-9]{34}\b(?=.*etherscan)/gi },
  { kind: "moralis_api_key", label: "Moralis API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*moralis)/gi },
  { kind: "nft_storage_key", label: "NFT.Storage API Key", severity: 5, confidence: "high", regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9._-]{8,}\.[A-Za-z0-9._-]{8,}\b/g },
  { kind: "web3_storage_key", label: "Web3.Storage API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*web3\.storage)/gi },
  { kind: "pinata_api_key", label: "Pinata API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{20,}\b(?=.*pinata)/gi },
  { kind: "pinata_secret", label: "Pinata Secret API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{64,}\b(?=.*pinata)/gi },
  { kind: "blocknative_api_key", label: "Blocknative API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9-]{36}\b(?=.*blocknative)/gi },
  { kind: "openai_org_id", label: "OpenAI Organization ID", severity: 2, confidence: "low", regex: /\borg-[A-Za-z0-9]{24}\b/g },
  { kind: "replicate_model_token", label: "Replicate Model Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{40,}\b(?=.*replicate)/gi },
  { kind: "huggingface_org_api_key", label: "Hugging Face Organization Key", severity: 5, confidence: "medium", regex: /\bhf_org_[A-Za-z0-9]{20,}\b/g },
  { kind: "elevenlabs_api_key", label: "ElevenLabs API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*elevenlabs)/gi },
  { kind: "runpod_api_key", label: "RunPod API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{32,}\b(?=.*runpod)/gi },
  { kind: "banana_dev_api_key", label: "Banana.dev API Key", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32,}\b(?=.*banana)/gi },
  { kind: "modal_token", label: "Modal Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{40,}\b(?=.*modal)/gi },
  { kind: "ngrok_auth_token", label: "ngrok Authtoken", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{20,}\b(?=.*ngrok)/gi },
  { kind: "ngrok_api_key", label: "ngrok API Key", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9]{30,}\b(?=.*ngrok)/gi },
  { kind: "localtunnel_password", label: "Localtunnel Password", severity: 3, confidence: "low", regex: /\b(?:localtunnel[_-]?password|lt[_-]?password)\b\s*[:=]\s*['"`]?([^'"`\s]{8,})['"`]?/gi, captureGroup: 1 },
  { kind: "cloudflare_tunnel_token", label: "Cloudflare Tunnel Token", severity: 5, confidence: "high", regex: /\b[A-Za-z0-9_-]{40,}\b(?=.*cloudflared)/gi },
  { kind: "twitch_client_secret", label: "Twitch Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{30,}\b(?=.*twitch)/gi },
  { kind: "twitch_oauth_token", label: "Twitch OAuth Token", severity: 5, confidence: "medium", regex: /\b[a-z0-9]{30,}\b(?=.*twitch)/gi },
  { kind: "youtube_api_key", label: "YouTube API Key", severity: 5, confidence: "high", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { kind: "spotify_client_secret", label: "Spotify Client Secret", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9]{32}\b(?=.*spotify)/gi },
  { kind: "spotify_refresh_token", label: "Spotify Refresh Token", severity: 5, confidence: "medium", regex: /\b[A-Za-z0-9_-]{100,}\b(?=.*spotify)/gi },
  { kind: "apple_app_specific_password", label: "Apple App-Specific Password", severity: 5, confidence: "medium", regex: /\b[a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4}\b/g },
  { kind: "apple_private_key", label: "Apple Private Key", severity: 6, confidence: "high", regex: /-----BEGIN PRIVATE KEY-----[\s\S]{40,}?-----END PRIVATE KEY-----/g },
  { kind: "apple_team_id", label: "Apple Team ID Context", severity: 2, confidence: "low", regex: /\b[A-Z0-9]{10}\b(?=.*apple)/gi },
  { kind: "apple_key_id", label: "Apple Key ID Context", severity: 2, confidence: "low", regex: /\b[A-Z0-9]{10}\b(?=.*key)/gi },

  // ========== MISCELLANEOUS ==========
  { kind: "ssh_public_key", label: "SSH Public Key", severity: 1, confidence: "low", regex: /\bssh-rsa\s+[A-Za-z0-9+/=]{200,}\b/g },
  { kind: "ssl_certificate", label: "SSL Certificate", severity: 1, confidence: "low", regex: /-----BEGIN CERTIFICATE-----[\s\S]{20,}?-----END CERTIFICATE-----/g },
  { kind: "bearer_token_context", label: "Bearer Token", severity: 4, confidence: "medium", regex: /Authorization:\s*Bearer\s+([A-Za-z0-9._-]{20,})/gi, captureGroup: 1 },
  { kind: "api_key_in_query", label: "API Key in URL Query", severity: 4, confidence: "medium", regex: /[?&](?:api_key|apikey|key|token|secret)=([^&\s]{8,})/gi, captureGroup: 1 },
  { kind: "password_in_url", label: "Password in URL", severity: 5, confidence: "high", regex: /\/\/[^/\s]*:[^@\s]+@/g },
  { kind: "generic_api_key", label: "Generic API Key Pattern", severity: 3, confidence: "low", regex: /\b[A-Za-z0-9]{32,}\b(?=.*(?:api|key|token|secret))/gi }
];

module.exports = { SECRET_RULES };