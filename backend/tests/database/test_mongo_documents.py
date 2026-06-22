class FakeMongoCollection:
    def __init__(self):
        self.documents = []

    def insert_one(self, document):
        next_document = {**document, "_id": len(self.documents) + 1}
        self.documents.append(next_document)
        return next_document

    def find(self, filters):
        return [
            document
            for document in self.documents
            if all(document.get(key) == value for key, value in filters.items())
        ]

    def delete_many(self, filters):
        initial_count = len(self.documents)
        self.documents = [
            document
            for document in self.documents
            if not all(document.get(key) == value for key, value in filters.items())
        ]
        return initial_count - len(self.documents)


def test_mongo_study_session_document_can_be_inserted_and_found():
    collection = FakeMongoCollection()
    collection.insert_one({
        "user_id": 1,
        "subject_id": 10,
        "duration_minutes": 45,
        "notes": "Sesion de prueba",
    })

    results = collection.find({"user_id": 1, "subject_id": 10})

    assert len(results) == 1
    assert results[0]["duration_minutes"] == 45


def test_mongo_resource_document_keeps_https_url():
    collection = FakeMongoCollection()
    collection.insert_one({
        "user_id": 1,
        "subject_id": 10,
        "title": "Recurso Prueba",
        "url": "https://www.example.com",
        "resource_type": "documentation",
    })

    resource = collection.find({"user_id": 1})[0]

    assert resource["url"].startswith("https://")


def test_mongo_collection_can_be_cleaned_between_tests():
    collection = FakeMongoCollection()
    collection.insert_one({"user_id": 1, "title": "Documento A"})
    collection.insert_one({"user_id": 1, "title": "Documento B"})
    collection.insert_one({"user_id": 2, "title": "Documento C"})

    deleted_count = collection.delete_many({"user_id": 1})

    assert deleted_count == 2
    assert len(collection.find({"user_id": 1})) == 0
    assert len(collection.find({"user_id": 2})) == 1
