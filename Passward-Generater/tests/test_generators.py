import unittest
import string
from generators import generate_password, generate_passphrase, generate_pin

class TestGenerators(unittest.TestCase):
    def test_random_length(self):
        self.assertEqual(len(generate_password(length=20)), 20)

    def test_passphrase_words(self):
        phrase = generate_passphrase(num_words=5, separator="-")
        self.assertEqual(len(phrase.split("-")), 5)

    def test_pin_digits(self):
        pin = generate_pin(length=6)
        self.assertTrue(pin.isdigit())
        self.assertEqual(len(pin), 6)

if __name__ == '__main__':
    unittest.main()
