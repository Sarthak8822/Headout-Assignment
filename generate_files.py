# This is the script to generate 20 text files and store them in the tmp/data directory 

import os
import random
import string

def generate_random_line(length):
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length))

def create_text_file(file_path, file_size, line_length):
    with open(file_path, 'w') as file:
        while file.tell() < file_size:
            file.write(generate_random_line(line_length) + '\n')

def create_files(base_directory, num_files, file_size, line_length):
    for i in range(1, num_files + 1):
        file_name = f"{i}.txt"
        file_path = os.path.join(base_directory, file_name)
        create_text_file(file_path, file_size, line_length)
        print(f"File created: {file_path}")

if __name__ == "__main__":
    base_directory = '/tmp/data'
    num_files = 30
    file_size = 100 * 1024 * 1024  # 100MB
    line_length = 80

    if not os.path.exists(base_directory):
        os.makedirs(base_directory)

    create_files(base_directory, num_files, file_size, line_length)
