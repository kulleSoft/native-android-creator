import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Termos de Uso e Privacidade</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-muted-foreground">
                <section>
                  <h3 className="text-foreground font-semibold mb-2">1. Sobre o Aplicativo</h3>
                  <p>
                    O Calm Music Night é um aplicativo gratuito de sons relaxantes para ajudar você a dormir, 
                    estudar e relaxar. Ao utilizar este aplicativo, você concorda com estes termos.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">2. Publicidade</h3>
                  <p>
                    Este aplicativo é suportado por anúncios. Exibimos anúncios de terceiros para manter o 
                    aplicativo gratuito. Os provedores de anúncios podem coletar dados anônimos sobre seu 
                    dispositivo e uso para exibir anúncios relevantes.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">3. Coleta de Dados</h3>
                  <p>
                    Coletamos dados mínimos necessários para o funcionamento do aplicativo:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Preferências de som e configurações (armazenados localmente)</li>
                    <li>Dados anônimos de uso para melhorar o aplicativo</li>
                    <li>Identificadores de publicidade para exibição de anúncios</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">4. Uso dos Dados</h3>
                  <p>
                    Seus dados são utilizados exclusivamente para:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Salvar suas preferências e favoritos</li>
                    <li>Exibir anúncios personalizados</li>
                    <li>Melhorar a experiência do usuário</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">5. Seus Direitos</h3>
                  <p>
                    Você pode a qualquer momento:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Excluir seus dados locais desinstalando o aplicativo</li>
                    <li>Optar por não receber anúncios personalizados nas configurações do dispositivo</li>
                    <li>Solicitar informações sobre seus dados</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">6. Isenção de Responsabilidade</h3>
                  <p>
                    Os sons disponíveis são destinados apenas para relaxamento. Não nos responsabilizamos 
                    por qualquer uso inadequado ou efeitos adversos. Consulte um profissional de saúde 
                    para problemas de sono.
                  </p>
                </section>

                <section>
                  <h3 className="text-foreground font-semibold mb-2">7. Contato</h3>
                  <p>
                    Para dúvidas ou solicitações sobre privacidade, entre em contato através da 
                    página do aplicativo na Play Store.
                  </p>
                </section>

                <p className="text-xs text-muted-foreground/70 pt-4 border-t border-border">
                  Última atualização: Janeiro de 2026
                </p>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Entendi
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
