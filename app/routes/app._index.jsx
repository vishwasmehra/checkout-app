// app/routes/_index.jsx or app/routes/dashboard.jsx
// Main dashboard page for the app. Shows navigation, status, and rules table.

// Import core UI components from Shopify Polaris for layout, buttons, cards, and icons
import {
  Page, Card, Button, BlockStack, InlineStack, Text, Box, Badge, DataTable, ButtonGroup, Icon, Select, Modal, TextField
} from "@shopify/polaris";
// Import specific icons for use in action buttons
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
// Import React's useState for managing local component state
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { parse } from "cookie";
import prisma from "~/db.server";
import RuleForm from "../RuleForm";

// Loader to get language from cookie
export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const { parse } = await import("cookie");
  const cookies = parse(cookieHeader);
  const language = cookies.language || "en";
  // Fetch rules from the database
  const rules = await prisma.rule.findMany({ orderBy: { createdAt: "desc" } });
  return json({ language, rules });
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "delete") {
    const id = formData.get("id");
    await prisma.rule.delete({ where: { id: String(id) } });
    return json({ success: true });
  }
  if (intent === "edit") {
    const id = formData.get("id");
    await prisma.rule.update({
      where: { id: String(id) },
      data: {
        title: formData.get("title"),
        ruleSetType: formData.get("action"),
        condition: formData.get("condition"),
        operator: formData.get("operator"),
        value: formData.get("value"),
        thenAction: formData.get("thenAction")
      }
    });
    return json({ success: true });
  }
  if (intent === "toggle") {
    const id = formData.get("id");
    const status = formData.get("status") === 'true';
    await prisma.rule.update({
      where: { id: String(id) },
      data: { status }
    });
    return json({ success: true });
  }
  return json({});
}

// Main dashboard component
export default function DashboardPage() {
  const { language: initialLanguage, rules } = useLoaderData();
  const [language, setLanguage] = useState(initialLanguage);
  const navigation = useNavigation();
  const [editModalActive, setEditModalActive] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', ruleSetType: '', condition: '', operator: '', value: '', thenAction: '' });

  // Translation dictionary
  const translations = {
    en: {
      dashboard: "Dashboard",
      landing: "Landing Page/ Homepage",
      quickSetup: "Quick Setup Wizard",
      createPayment: "Create Payment Customization",
      settings: "Settings",
      helpDocs: "Help Docs",
      support: "Support",
      activePayment: "Active Payment Customizations",
      ourAppActive: "Our App active delivery rule(s)",
      yourRules: "Your activated / created rules count.",
      hide: "Hide",
      sort: "Sort",
      rename: "Rename",
      activeRulesSummary: "Active Rules Summary",
      noActiveRules: "No active rules found. Create your first payment customization rule.",
      createRule: "Create Payment Customization",
      limitations: "Limitations",
      limitation1: "The Payment Customization API doesn't currently support draft orders.",
      limitation2: "You can't rename payment methods that have logos.",
      limitation3: "Payment customizations aren't compatible with Shop Pay (Mobile App).",
      limitation4: "You can activate only 5 Payment customization methods at a time.",
      limitation5: "APP do not hide express checkout button, you have to disable it from Shopify's settings.",
      limitation6: "Once Shopify will launch the update, we will update our app accordingly.",
      enabled: "Enabled",
      disabled: "Disabled",
      title: "Title",
      ruleSetType: "Rule Set Type",
      status: "Status",
      action: "Action"
    },
    fr: { /* French translations */ dashboard: "Tableau de bord", landing: "Page d'accueil", quickSetup: "Assistant de configuration rapide", createPayment: "Créer une personnalisation de paiement", settings: "Paramètres", helpDocs: "Aide", support: "Assistance", activePayment: "Personnalisations de paiement actives", ourAppActive: "Règle(s) de livraison active(s) de notre application", yourRules: "Nombre de règles activées / créées.", hide: "Cacher", sort: "Trier", rename: "Renommer", activeRulesSummary: "Résumé des règles actives", noActiveRules: "Aucune règle active trouvée. Créez votre première règle de personnalisation de paiement.", createRule: "Créer une personnalisation de paiement", limitations: "Limitations", limitation1: "L'API de personnalisation de paiement ne prend pas en charge les commandes provisoires.", limitation2: "Vous ne pouvez pas renommer les méthodes de paiement avec des logos.", limitation3: "Les personnalisations de paiement ne sont pas compatibles avec Shop Pay (application mobile).", limitation4: "Vous ne pouvez activer que 5 méthodes de personnalisation de paiement à la fois.", limitation5: "L'application ne masque pas le bouton de paiement express, vous devez le désactiver dans les paramètres Shopify.", limitation6: "Une fois la mise à jour lancée par Shopify, nous mettrons à jour notre application en conséquence.", enabled: "Activé", disabled: "Désactivé", title: "Titre", ruleSetType: "Type de règle", status: "Statut", action: "Action" },
    de: { /* German translations */ dashboard: "Dashboard", landing: "Startseite", quickSetup: "Schnellstart-Assistent", createPayment: "Zahlungsanpassung erstellen", settings: "Einstellungen", helpDocs: "Hilfe", support: "Support", activePayment: "Aktive Zahlungsanpassungen", ourAppActive: "Unsere App aktive Lieferregel(n)", yourRules: "Ihre aktivierten / erstellten Regeln.", hide: "Ausblenden", sort: "Sortieren", rename: "Umbenennen", activeRulesSummary: "Zusammenfassung der aktiven Regeln", noActiveRules: "Keine aktiven Regeln gefunden. Erstellen Sie Ihre erste Zahlungsanpassungsregel.", createRule: "Zahlungsanpassung erstellen", limitations: "Einschränkungen", limitation1: "Die Payment Customization API unterstützt derzeit keine Entwurfsbestellungen.", limitation2: "Sie können Zahlungsmethoden mit Logos nicht umbenennen.", limitation3: "Zahlungsanpassungen sind nicht mit Shop Pay (Mobile App) kompatibel.", limitation4: "Sie können nur 5 Zahlungsanpassungsmethoden gleichzeitig aktivieren.", limitation5: "Die App blendet die Express-Checkout-Schaltfläche nicht aus, Sie müssen sie in den Shopify-Einstellungen deaktivieren.", limitation6: "Sobald Shopify das Update veröffentlicht, werden wir unsere App entsprechend aktualisieren.", enabled: "Aktiviert", disabled: "Deaktiviert", title: "Titel", ruleSetType: "Regeltyp", status: "Status", action: "Aktion" },
    ru: { /* Russian translations */ dashboard: "Панель управления", landing: "Главная страница", quickSetup: "Мастер быстрой настройки", createPayment: "Создать настройку оплаты", settings: "Настройки", helpDocs: "Документация", support: "Поддержка", activePayment: "Активные настройки оплаты", ourAppActive: "Активное правило доставки нашего приложения", yourRules: "Ваши активированные / созданные правила.", hide: "Скрыть", sort: "Сортировать", rename: "Переименовать", activeRulesSummary: "Сводка активных правил", noActiveRules: "Активные правила не найдены. Создайте свое первое правило настройки оплаты.", createRule: "Создать настройку оплаты", limitations: "Ограничения", limitation1: "API настройки оплаты в настоящее время не поддерживает черновики заказов.", limitation2: "Вы не можете переименовывать методы оплаты с логотипами.", limitation3: "Настройки оплаты несовместимы с Shop Pay (мобильное приложение).", limitation4: "Вы можете активировать только 5 методов настройки оплаты одновременно.", limitation5: "Приложение не скрывает кнопку экспресс-оплаты, вы должны отключить ее в настройках Shopify.", limitation6: "Как только Shopify выпустит обновление, мы обновим наше приложение соответственно.", enabled: "Включено", disabled: "Отключено", title: "Название", ruleSetType: "Тип правила", status: "Статус", action: "Действие" },
    hi: { /* Hindi translations */ dashboard: "डैशबोर्ड", landing: "मुखपृष्ठ", quickSetup: "त्वरित सेटअप विज़ार्ड", createPayment: "भुगतान अनुकूलन बनाएँ", settings: "सेटिंग्स", helpDocs: "सहायता दस्तावेज़", support: "सहायता", activePayment: "सक्रिय भुगतान अनुकूलन", ourAppActive: "हमारे ऐप की सक्रिय डिलीवरी नियम(न)", yourRules: "आपके सक्रिय / बनाए गए नियम.", hide: "छिपाएँ", sort: "क्रमबद्ध करें", rename: "नाम बदलें", activeRulesSummary: "सक्रिय नियम सारांश", noActiveRules: "कोई सक्रिय नियम नहीं मिले। अपना पहला भुगतान अनुकूलन नियम बनाएँ।", createRule: "भुगतान अनुकूलन बनाएँ", limitations: "सीमाएँ", limitation1: "भुगतान अनुकूलन API वर्तमान में ड्राफ्ट ऑर्डर का समर्थन नहीं करता है।", limitation2: "आप उन भुगतान विधियों का नाम नहीं बदल सकते जिनके पास लोगो हैं।", limitation3: "भुगतान अनुकूलन Shop Pay (मोबाइल ऐप) के साथ संगत नहीं हैं।", limitation4: "आप एक बार में केवल 5 भुगतान अनुकूलन विधियाँ सक्रिय कर सकते हैं।", limitation5: "ऐप एक्सप्रेस चेकआउट बटन नहीं छुपाता, आपको इसे Shopify सेटिंग्स से अक्षम करना होगा।", limitation6: "एक बार Shopify अपडेट जारी कर देगा, हम अपनी ऐप को तदनुसार अपडेट करेंगे।", enabled: "सक्रिय", disabled: "निष्क्रिय", title: "शीर्षक", ruleSetType: "नियम प्रकार", status: "स्थिति", action: "क्रिया" },
    es: { dashboard: "Tablero", landing: "Página principal", quickSetup: "Asistente de configuración rápida", createPayment: "Crear personalización de pago", settings: "Configuraciones", helpDocs: "Documentos de ayuda", support: "Soporte", activePayment: "Personalizaciones de pago activas", ourAppActive: "Regla(s) de entrega activa(s) de nuestra aplicación", yourRules: "Recuento de reglas activadas / creadas.", hide: "Ocultar", sort: "Ordenar", rename: "Renombrar", activeRulesSummary: "Resumen de reglas activas", noActiveRules: "No se encontraron reglas activas. Cree su primera regla de personalización de pago.", createRule: "Crear personalización de pago", limitations: "Limitaciones", limitation1: "La API de personalización de pagos actualmente no admite pedidos en borrador.", limitation2: "No puede cambiar el nombre de los métodos de pago que tienen logotipos.", limitation3: "Las personalizaciones de pago no son compatibles con Shop Pay (aplicación móvil).", limitation4: "Solo puede activar 5 métodos de personalización de pago a la vez.", limitation5: "La aplicación no oculta el botón de pago exprés, debe desactivarlo desde la configuración de Shopify.", limitation6: "Una vez que Shopify lance la actualización, actualizaremos nuestra aplicación en consecuencia.", enabled: "Habilitado", disabled: "Deshabilitado", title: "Título", ruleSetType: "Tipo de regla", status: "Estado", action: "Acción" },
    it: { dashboard: "Cruscotto", landing: "Pagina principale", quickSetup: "Procedura guidata di configurazione rapida", createPayment: "Crea personalizzazione pagamento", settings: "Impostazioni", helpDocs: "Documenti di aiuto", support: "Supporto", activePayment: "Personalizzazioni di pagamento attive", ourAppActive: "Regola(e) di consegna attiva della nostra app", yourRules: "Conteggio delle regole attivate / create.", hide: "Nascondi", sort: "Ordina", rename: "Rinomina", activeRulesSummary: "Riepilogo regole attive", noActiveRules: "Nessuna regola attiva trovata. Crea la tua prima regola di personalizzazione del pagamento.", createRule: "Crea personalizzazione pagamento", limitations: "Limitazioni", limitation1: "L'API di personalizzazione dei pagamenti attualmente non supporta gli ordini bozza.", limitation2: "Non puoi rinominare i metodi di pagamento che hanno loghi.", limitation3: "Le personalizzazioni di pagamento non sono compatibili con Shop Pay (app mobile).", limitation4: "Puoi attivare solo 5 metodi di personalizzazione del pagamento alla volta.", limitation5: "L'app non nasconde il pulsante di checkout express, devi disabilitarlo dalle impostazioni di Shopify.", limitation6: "Una volta che Shopify lancerà l'aggiornamento, aggiorneremo la nostra app di conseguenza.", enabled: "Abilitato", disabled: "Disabilitato", title: "Titolo", ruleSetType: "Tipo di regola", status: "Stato", action: "Azione" },
    zh: { dashboard: "仪表板", landing: "主页", quickSetup: "快速设置向导", createPayment: "创建支付自定义", settings: "设置", helpDocs: "帮助文档", support: "支持", activePayment: "活跃的支付自定义", ourAppActive: "我们的应用活跃的交付规则", yourRules: "您激活/创建的规则数。", hide: "隐藏", sort: "排序", rename: "重命名", activeRulesSummary: "活跃规则摘要", noActiveRules: "未找到活跃规则。请创建您的第一个支付自定义规则。", createRule: "创建支付自定义", limitations: "限制", limitation1: "支付自定义 API 当前不支持草稿订单。", limitation2: "您无法重命名带有徽标的支付方式。", limitation3: "支付自定义与 Shop Pay（移动应用）不兼容。", limitation4: "您一次只能激活 5 个支付自定义方法。", limitation5: "应用不会隐藏快捷结账按钮，您需要在 Shopify 设置中禁用它。", limitation6: "一旦 Shopify 推出更新，我们会相应地更新我们的应用。", enabled: "已启用", disabled: "已禁用", title: "标题", ruleSetType: "规则类型", status: "状态", action: "操作" },
    ja: { dashboard: "ダッシュボード", landing: "ホームページ", quickSetup: "クイックセットアップウィザード", createPayment: "支払いカスタマイズを作成", settings: "設定", helpDocs: "ヘルプドキュメント", support: "サポート", activePayment: "アクティブな支払いカスタマイズ", ourAppActive: "当アプリのアクティブな配信ルール", yourRules: "有効化/作成したルール数。", hide: "非表示", sort: "並べ替え", rename: "名前を変更", activeRulesSummary: "アクティブルールの概要", noActiveRules: "アクティブルールが見つかりません。最初の支払いカスタマイズルールを作成してください。", createRule: "支払いカスタマイズを作成", limitations: "制限事項", limitation1: "支払いカスタマイズ API は現在ドラフト注文をサポートしていません。", limitation2: "ロゴがある支払い方法の名前は変更できません。", limitation3: "支払いカスタマイズは Shop Pay（モバイルアプリ）と互換性がありません。", limitation4: "一度に有効化できる支払いカスタマイズ方法は 5 つまでです。", limitation5: "アプリはエクスプレスチェックアウトボタンを非表示にしません。Shopify の設定で無効にしてください。", limitation6: "Shopifyがアップデートをリリースしたら、当アプリもそれに合わせて更新します。", enabled: "有効", disabled: "無効", title: "タイトル", ruleSetType: "ルールタイプ", status: "ステータス", action: "アクション" },
    ar: { dashboard: "لوحة التحكم", landing: "الصفحة الرئيسية", quickSetup: "معالج الإعداد السريع", createPayment: "إنشاء تخصيص الدفع", settings: "الإعدادات", helpDocs: "مستندات المساعدة", support: "الدعم", activePayment: "تخصيصات الدفع النشطة", ourAppActive: "قاعدة التوصيل النشطة لتطبيقنا", yourRules: "عدد القواعد المفعلة / التي تم إنشاؤها.", hide: "إخفاء", sort: "ترتيب", rename: "إعادة تسمية", activeRulesSummary: "ملخص القواعد النشطة", noActiveRules: "لم يتم العثور على قواعد نشطة. أنشئ أول قاعدة تخصيص دفع لك.", createRule: "إنشاء تخصيص الدفع", limitations: "القيود", limitation1: "واجهة برمجة تطبيقات تخصيص الدفع لا تدعم حاليًا الطلبات المؤقتة.", limitation2: "لا يمكنك إعادة تسمية طرق الدفع التي تحتوي على شعارات.", limitation3: "تخصيصات الدفع غير متوافقة مع Shop Pay (تطبيق الجوال).", limitation4: "يمكنك تفعيل 5 طرق تخصيص دفع فقط في نفس الوقت.", limitation5: "التطبيق لا يخفي زر الدفع السريع، يجب عليك تعطيله من إعدادات Shopify.", limitation6: "بمجرد أن تطلق Shopify التحديث، سنقوم بتحديث تطبيقنا وفقًا لذلك.", enabled: "مفعل", disabled: "غير مفعل", title: "العنوان", ruleSetType: "نوع القاعدة", status: "الحالة", action: "الإجراء" },
    pt: { dashboard: "Painel", landing: "Página inicial", quickSetup: "Assistente de configuração rápida", createPayment: "Criar personalização de pagamento", settings: "Configurações", helpDocs: "Documentos de ajuda", support: "Suporte", activePayment: "Personalizações de pagamento ativas", ourAppActive: "Regra(s) de entrega ativa(s) do nosso aplicativo", yourRules: "Contagem de regras ativadas / criadas.", hide: "Ocultar", sort: "Ordenar", rename: "Renomear", activeRulesSummary: "Resumo das regras ativas", noActiveRules: "Nenhuma regra ativa encontrada. Crie sua primeira regra de personalização de pagamento.", createRule: "Criar personalização de pagamento", limitations: "Limitações", limitation1: "A API de personalização de pagamento atualmente não suporta pedidos em rascunho.", limitation2: "Você não pode renomear métodos de pagamento que possuem logotipos.", limitation3: "Personalizações de pagamento não são compatíveis com Shop Pay (aplicativo móvel).", limitation4: "Você só pode ativar 5 métodos de personalização de pagamento por vez.", limitation5: "O aplicativo não oculta o botão de checkout expresso, você deve desativá-lo nas configurações do Shopify.", limitation6: "Assim que a Shopify lançar a atualização, atualizaremos nosso aplicativo de acordo.", enabled: "Ativado", disabled: "Desativado", title: "Título", ruleSetType: "Tipo de regra", status: "Status", action: "Ação" },
    tr: { dashboard: "Kontrol Paneli", landing: "Ana Sayfa", quickSetup: "Hızlı Kurulum Sihirbazı", createPayment: "Ödeme Özelleştirmesi Oluştur", settings: "Ayarlar", helpDocs: "Yardım Dokümanları", support: "Destek", activePayment: "Aktif Ödeme Özelleştirmeleri", ourAppActive: "Uygulamamızın aktif teslimat kural(lar)ı", yourRules: "Aktif / oluşturulan kural sayınız.", hide: "Gizle", sort: "Sırala", rename: "Yeniden Adlandır", activeRulesSummary: "Aktif Kurallar Özeti", noActiveRules: "Aktif kural bulunamadı. İlk ödeme özelleştirme kuralınızı oluşturun.", createRule: "Ödeme Özelleştirmesi Oluştur", limitations: "Sınırlamalar", limitation1: "Ödeme Özelleştirme API'si şu anda taslak siparişleri desteklemiyor.", limitation2: "Logosu olan ödeme yöntemlerinin adını değiştiremezsiniz.", limitation3: "Ödeme özelleştirmeleri Shop Pay (Mobil Uygulama) ile uyumlu değildir.", limitation4: "Aynı anda yalnızca 5 ödeme özelleştirme yöntemi etkinleştirilebilir.", limitation5: "Uygulama, hızlı ödeme düğmesini gizlemez, bunu Shopify ayarlarından devre dışı bırakmalısınız.", limitation6: "Shopify güncellemeyi başlattığında, uygulamamızı buna göre güncelleyeceğiz.", enabled: "Etkin", disabled: "Devre Dışı", title: "Başlık", ruleSetType: "Kural Türü", status: "Durum", action: "Eylem" },
    ko: { dashboard: "대시보드", landing: "홈페이지", quickSetup: "빠른 설정 마법사", createPayment: "결제 맞춤화 생성", settings: "설정", helpDocs: "도움말 문서", support: "지원", activePayment: "활성 결제 맞춤화", ourAppActive: "우리 앱의 활성 배송 규칙", yourRules: "활성화/생성된 규칙 수.", hide: "숨기기", sort: "정렬", rename: "이름 바꾸기", activeRulesSummary: "활성 규칙 요약", noActiveRules: "활성 규칙을 찾을 수 없습니다. 첫 번째 결제 맞춤화 규칙을 만드세요.", createRule: "결제 맞춤화 생성", limitations: "제한 사항", limitation1: "결제 맞춤화 API는 현재 임시 주문을 지원하지 않습니다.", limitation2: "로고가 있는 결제 방법의 이름을 바꿀 수 없습니다.", limitation3: "결제 맞춤화는 Shop Pay(모바일 앱)와 호환되지 않습니다.", limitation4: "한 번에 5개의 결제 맞춤화 방법만 활성화할 수 있습니다.", limitation5: "앱은 익스프레스 체크아웃 버튼을 숨기지 않습니다. Shopify 설정에서 비활성화해야 합니다.", limitation6: "Shopify가 업데이트를 출시하면 앱도 그에 따라 업데이트할 것입니다.", enabled: "활성화됨", disabled: "비활성화됨", title: "제목", ruleSetType: "규칙 유형", status: "상태", action: "동작" },
    nl: { dashboard: "Dashboard", landing: "Startpagina", quickSetup: "Snelle setup wizard", createPayment: "Betalingsaanpassing maken", settings: "Instellingen", helpDocs: "Helpdocumenten", support: "Ondersteuning", activePayment: "Actieve betalingsaanpassingen", ourAppActive: "Onze app actieve leveringsregel(s)", yourRules: "Uw geactiveerde / gemaakte regels.", hide: "Verbergen", sort: "Sorteren", rename: "Hernoemen", activeRulesSummary: "Overzicht van actieve regels", noActiveRules: "Geen actieve regels gevonden. Maak uw eerste betalingsaanpassingsregel.", createRule: "Betalingsaanpassing maken", limitations: "Beperkingen", limitation1: "De Payment Customization API ondersteunt momenteel geen conceptbestellingen.", limitation2: "U kunt betaalmethoden met logo's niet hernoemen.", limitation3: "Betalingsaanpassingen zijn niet compatibel met Shop Pay (mobiele app).", limitation4: "U kunt slechts 5 betalingsaanpassingsmethoden tegelijk activeren.", limitation5: "De app verbergt de express checkout-knop niet, u moet deze uitschakelen in de Shopify-instellingen.", limitation6: "Zodra Shopify de update uitbrengt, zullen we onze app dienovereenkomstig bijwerken.", enabled: "Ingeschakeld", disabled: "Uitgeschakeld", title: "Titel", ruleSetType: "Regeltype", status: "Status", action: "Actie" },
    pl: { dashboard: "Panel", landing: "Strona główna", quickSetup: "Szybki kreator konfiguracji", createPayment: "Utwórz dostosowanie płatności", settings: "Ustawienia", helpDocs: "Dokumentacja pomocy", support: "Wsparcie", activePayment: "Aktywne dostosowania płatności", ourAppActive: "Aktywna reguła dostawy naszej aplikacji", yourRules: "Liczba aktywowanych / utworzonych reguł.", hide: "Ukryj", sort: "Sortuj", rename: "Zmień nazwę", activeRulesSummary: "Podsumowanie aktywnych reguł", noActiveRules: "Nie znaleziono aktywnych reguł. Utwórz swoją pierwszą regułę dostosowania płatności.", createRule: "Utwórz dostosowanie płatności", limitations: "Ograniczenia", limitation1: "API dostosowywania płatności nie obsługuje obecnie zamówień roboczych.", limitation2: "Nie można zmienić nazwy metod płatności z logo.", limitation3: "Dostosowania płatności nie są kompatybilne z Shop Pay (aplikacja mobilna).", limitation4: "Możesz aktywować tylko 5 metod dostosowywania płatności jednocześnie.", limitation5: "Aplikacja nie ukrywa przycisku ekspresowego zakupu, musisz go wyłączyć w ustawieniach Shopify.", limitation6: "Gdy Shopify uruchomi aktualizację, zaktualizujemy naszą aplikację odpowiednio.", enabled: "Włączony", disabled: "Wyłączony", title: "Tytuł", ruleSetType: "Typ reguły", status: "Status", action: "Akcja" }
  };

  // Language options
  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Français", value: "fr" },
    { label: "Deutsch", value: "de" },
    { label: "Русский", value: "ru" },
    { label: "हिन्दी", value: "hi" },
    { label: "Español", value: "es" },
    { label: "Italiano", value: "it" },
    { label: "中文", value: "zh" },
    { label: "日本語", value: "ja" },
    { label: "العربية", value: "ar" },
    { label: "Português", value: "pt" },
    { label: "Türkçe", value: "tr" },
    { label: "한국어", value: "ko" },
    { label: "Nederlands", value: "nl" },
    { label: "Polski", value: "pl" }
  ];

  // Translation function
  const t = (key) => translations[language][key] || key;

  // Handler to open edit modal
  const handleEdit = (rule) => {
    setEditRule(rule);
    setEditFields({
      title: rule.title || '',
      ruleSetType: rule.ruleSetType || '',
      condition: rule.condition || '',
      operator: rule.operator || '',
      value: rule.value || '',
      thenAction: rule.thenAction || ''
    });
    setEditModalActive(true);
  };

  // Handler to toggle status
  const handleToggleStatus = async (rule) => {
    await fetch(`/app?_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        intent: 'toggle',
        id: rule.id,
        status: (!rule.status).toString()
      })
    });
    window.location.reload();
  };

  // Use rules from loader for table and counts
  const hideTotal = rules.filter(r => r.ruleSetType === "Hide").length;
  const hideActive = rules.filter(r => r.ruleSetType === "Hide" && r.status).length;
  const sortTotal = rules.filter(r => r.ruleSetType === "Sort").length;
  const sortActive = rules.filter(r => r.ruleSetType === "Sort" && r.status).length;
  const renameTotal = rules.filter(r => r.ruleSetType === "Rename").length;
  const renameActive = rules.filter(r => r.ruleSetType === "Rename" && r.status).length;

  // Prepare table rows for displaying rules and their actions
  const tableRows = rules.map(rule => [
    rule.title,
    rule.ruleSetType,
    <Form method="post" key={`toggle-status-${rule.id}`}>
      <input type="hidden" name="intent" value="toggle" />
      <input type="hidden" name="id" value={rule.id} />
      <input type="hidden" name="status" value={!rule.status} />
      <Button
        variant={rule.status ? "primary" : "tertiary"}
        size="slim"
        submit
      >
        {rule.status ? t("enabled") : t("disabled")}
      </Button>
    </Form>,
    <ButtonGroup key={`actions-${rule.id}`}>
      <Button plain icon={EditIcon} onClick={() => handleEdit(rule)} />
      <Form method="post">
        <input type="hidden" name="id" value={rule.id} />
        <input type="hidden" name="intent" value="delete" />
        <Button
          variant="tertiary"
          size="slim"
          tone="critical"
          accessibilityLabel="Delete rule"
          submit
          loading={navigation.state === 'submitting'}
        >
          🗑️
        </Button>
      </Form>
    </ButtonGroup>
  ]);

  // On language change, update cookie and state
  function handleLanguageChange(newLang) {
    setLanguage(newLang);
    document.cookie = `language=${newLang}; path=/;`;
  }

  // Main dashboard layout with navigation, status cards, and rules table
  return (
    <Page
      title={t("landing")}
      titleMetadata={<Badge tone="info">{t("dashboard")}</Badge>}
    >
      <BlockStack gap="500">
        {/* Navigation buttons for quick access to other pages */}
        <Card>
          <Box padding="400">
            <InlineStack gap="300" wrap={false}>
              <Button
                variant="secondary"
                url="/app/quickSetup"
              >
                {t("quickSetup")}</Button>
              <Button
                variant="primary"
                icon={PlusIcon}
                url="/app/createPaymentRules"
              >
                {t("createRule")}
              </Button>
              <Button variant="tertiary">{t("settings")}</Button>
              <Button variant="tertiary">{t("helpDocs")}</Button>
              <Button variant="tertiary">{t("support")}</Button>
              <Box minWidth="180px">
                <Select
                  label="Language"
                  labelHidden
                  options={languageOptions}
                  value={language}
                  onChange={handleLanguageChange}
                />
              </Box>
            </InlineStack>
          </Box>
        </Card>

        {/* Summary cards at the top (replacing status cards) */}
        <InlineStack gap="400" align="start" blockAlign="center" justify="space-between">
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">{t("activePayment")}</Text>
              <Box paddingBlockStart="200">
                <Text variant="headingLg" as="span">0</Text>
                <Text variant="bodyMd" as="span"> /5 {t("ourAppActive")}</Text>
              </Box>
            </Box>
          </Card>
          <div style={{ flex: 1 }} />
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">{t("yourRules")}</Text>
              <InlineStack gap="200" align="center" blockAlign="center">
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t("hide")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{hideActive}/{hideTotal}</Text>
                  </Box>
                </Box>
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t("sort")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{sortActive}/{sortTotal}</Text>
                  </Box>
                </Box>
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t("rename")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{renameActive}/{renameTotal}</Text>
                  </Box>
                </Box>
              </InlineStack>
            </Box>
          </Card>
        </InlineStack>

        {/* Table of rules with actions */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">{t("activeRulesSummary")}</Text>
              {rules.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={['Title', 'Rule Set Type', 'Status', 'Action']}
                  rows={tableRows}
                />
              ) : (
                <Box padding="800" style={{ textAlign: 'center' }}>
                  <Text variant="bodyMd" color="subdued">
                    {t("noActiveRules")}
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Box>
        </Card>

        {/* Limitations Section */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">{t("limitations")}</Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">{t("limitation1")}</Text>
                <Text variant="bodyMd">{t("limitation2")}</Text>
                <Text variant="bodyMd">{t("limitation3")}</Text>
                <Text variant="bodyMd">{t("limitation4")}</Text>
                <Text variant="bodyMd">{t("limitation5")}</Text>
                <Text variant="bodyMd" color="subdued">
                  {t("limitation6")}
                </Text>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
      <Modal
        open={editModalActive}
        onClose={() => setEditModalActive(false)}
        title="Edit Rule"
        primaryAction={undefined}
      >
        <Modal.Section>
          {editRule && (
            <RuleForm
              type={editFields.ruleSetType}
              title={editFields.title}
              setTitle={v => setEditFields(f => ({ ...f, title: v }))}
              action={editFields.ruleSetType}
              setAction={v => setEditFields(f => ({ ...f, ruleSetType: v }))}
              condition={editFields.condition}
              setCondition={v => setEditFields(f => ({ ...f, condition: v }))}
              operator={editFields.operator}
              setOperator={v => setEditFields(f => ({ ...f, operator: v }))}
              value={editFields.value}
              setValue={v => setEditFields(f => ({ ...f, value: v }))}
              thenAction={editFields.thenAction}
              setThenAction={v => setEditFields(f => ({ ...f, thenAction: v }))}
              navigation={navigation}
              isEdit={true}
              editId={editRule.id}
              editIntent="edit"
            />
          )}
        </Modal.Section>
      </Modal>
    </Page>
  );
}