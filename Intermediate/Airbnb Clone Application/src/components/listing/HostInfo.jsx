import { MdVerified } from 'react-icons/md';
import { useToastStore } from '../../store/useToastStore';

const HostInfo = ({ host, reviewCount }) => {
  const { info } = useToastStore();
  const { name, avatar, isSuperhost, joinedYear } = host;

  const handleContactHost = () => {
    info('Messaging coming soon!');
  };

  return (
    <div className="py-8 border-t border-border" id="host">
      <div className="flex items-start gap-6">
        {/* Host Avatar */}
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full"
          />
          {isSuperhost && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-airbnb rounded-full flex items-center justify-center">
              <MdVerified className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Host Info */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1">Hosted by {name}</h3>
          <p className="text-text-secondary mb-4">
            Joined in {joinedYear} · {reviewCount} reviews
            {isSuperhost && ' · Superhost'}
          </p>

          <div className="space-y-2 mb-4">
            <p className="text-sm">Response rate: 100%</p>
            <p className="text-sm">Response time: within an hour</p>
          </div>

          <button
            onClick={handleContactHost}
            className="px-6 py-3 border border-text-primary rounded-lg font-medium hover:bg-bg-gray transition-colors"
          >
            Contact Host
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostInfo;
