import { Button, Modal, ModalContent, ModalFooter } from '@tailwindspark/ui-components';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import React from 'react';

/**
 * Modal component showcase section.
 * 
 * Demonstrates modal variants including basic, confirmation, alert, form,
 * and large modals with keyboard navigation and accessibility.
 * 
 * @returns Modal showcase section component
 * 
 * @example
 * ```tsx
 * <ModalShowcase />
 * ```
 */
export const ModalShowcase: React.FC = () => {
  const [basicModal, setBasicModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [formModal, setFormModal] = React.useState(false);
  const [largeModal, setLargeModal] = React.useState(false);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-text mb-4 text-2xl font-bold">
          Modal Components
        </h2>
        <p className="text-text-muted mb-6">
          Accessible modals with various sizes and configurations.
        </p>
      </div>

      {/* Modal Triggers */}
      <div className="space-y-4">
        <h3 className="text-text text-lg font-semibold">
          Modal Types
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setBasicModal(true)}>Basic Modal</Button>
          <Button variant="secondary" onClick={() => setConfirmModal(true)}>
            Confirmation Modal
          </Button>
          <Button variant="warning" onClick={() => setAlertModal(true)}>
            Alert Modal
          </Button>
          <Button variant="success" onClick={() => setFormModal(true)}>
            Form Modal
          </Button>
          <Button variant="ghost" onClick={() => setLargeModal(true)}>
            Large Modal
          </Button>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal isOpen={basicModal} onClose={() => setBasicModal(false)} title="Basic Modal" size="md">
        <ModalContent>
          <p className="text-text-muted">
            This is a basic modal with default configuration. It can contain any content and
            provides a clean, accessible interface for user interactions.
          </p>
          <div className="bg-surface-alt mt-4 rounded-lg p-4">
            <h4 className="text-text mb-2 font-semibold">
              Features:
            </h4>
            <ul className="text-text-muted space-y-1 text-sm">
              <li>• Keyboard navigation (ESC to close)</li>
              <li>• Click outside to close</li>
              <li>• Focus management</li>
              <li>• Smooth animations</li>
            </ul>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setBasicModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setBasicModal(false)}>Got it</Button>
        </ModalFooter>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        size="sm"
        showCloseButton={false}
      >
        <ModalContent>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-warning/30 bg-warning/10">
              <AlertCircle className="text-warning h-5 w-5" />
            </div>
            <div>
              <h3 className="text-text font-semibold">
                Confirm Action
              </h3>
              <p className="text-text-muted text-sm">
                Are you sure you want to delete this item?
              </p>
            </div>
          </div>
          <p className="text-text-muted">
            This action cannot be undone. The item will be permanently removed from your account.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="error" onClick={() => setConfirmModal(false)}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      {/* Alert Modal */}
      <Modal isOpen={alertModal} onClose={() => setAlertModal(false)} size="md">
        <ModalContent>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-success/30 bg-success/10">
              <CheckCircle className="text-success h-8 w-8" />
            </div>
            <h3 className="text-text mb-2 text-lg font-semibold">
              Success!
            </h3>
            <p className="text-text-muted">
              Your changes have been saved successfully. You can now continue with your workflow.
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button fullWidth onClick={() => setAlertModal(false)}>
            Continue
          </Button>
        </ModalFooter>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        title="Create New Project"
        size="lg"
      >
        <ModalContent>
          <form className="space-y-4">
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-text mb-2 block text-sm font-medium">
                Project Name
              </label>
              <input
                type="text"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Enter project name"
              />
            </div>
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-text mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
                placeholder="Describe your project"
              />
            </div>
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-text mb-2 block text-sm font-medium">
                Category
              </label>
              <select className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
                <option value="">Select a category</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>
          </form>
        </ModalContent>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setFormModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setFormModal(false)}>Create Project</Button>
        </ModalFooter>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={largeModal}
        onClose={() => setLargeModal(false)}
        title="Large Content Modal"
        size="xl"
      >
        <ModalContent>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Info className="text-brand mt-0.5 h-5 w-5" />
              <div>
                <h4 className="text-text mb-2 font-semibold">
                  About This Demo
                </h4>
                <p className="text-text-muted">
                  This modal demonstrates how larger content can be displayed effectively. The modal
                  scales appropriately and maintains good usability even with substantial content.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-panel border border-border bg-surface-alt p-4">
                <h5 className="mb-2 font-semibold text-text">
                  Responsive Design
                </h5>
                <p className="text-sm text-text-muted">
                  Modals adapt to different screen sizes while maintaining usability.
                </p>
              </div>
              <div className="rounded-panel border border-success/30 bg-success/10 p-4">
                <h5 className="mb-2 font-semibold text-success">
                  Accessibility
                </h5>
                <p className="text-sm text-success">
                  Built with keyboard navigation and screen reader support.
                </p>
              </div>
            </div>

            <div className="prose prose-sm text-text-muted max-w-none">
              <h4>Additional Features</h4>
              <ul>
                <li>Smooth animations and transitions</li>
                <li>Customizable sizes and configurations</li>
                <li>Portal rendering for proper layering</li>
                <li>Event handling for various interaction patterns</li>
                <li>Dark mode support with proper contrast</li>
              </ul>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setLargeModal(false)}>
            Close
          </Button>
          <Button onClick={() => setLargeModal(false)}>Understood</Button>
        </ModalFooter>
      </Modal>
    </section>
  );
};
